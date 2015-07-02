## The problem

In C++ there is no simple way to store values of different classes in the same base class. Let's say for example that
you want to store a container of properties but each property can either be a boolean, a string or even a color. You
would use something like that:

```
std::unordered_map<std::string, PropertyPointer> my_properties;
```

However, the problem here is that the property class here needs to accept values of any type, like so:

```
my_properties["basic_red"] = Color(255, 0, 0);
my_properties["is_enabled"] = true;
my_properties["duration"] = 4;
```

Boost provide `boost::any` to do this kind of things, you can use it like so:

```
std::map<std::string, boost::any> m;
m["basic_red"]  = Color(255, 0, 0);
m["is_enabled"]  = true;
m["duration"] = 4;

int i = boost::any_cast<int>(m["duration"]);
std::cout << "duration: " << i << std::endl;
```

As the name suggests `boost::any` allows to store any type. Also, you can do something like that for example:

```
m["basic_red"] = Color(255, 0, 0);
m["basic_red"] = true;
```

For this particular use case, I also would like to specify the way to set or get the value of the class. Indeed, for
some properties, I would like to initialize, get or set the property's value in different ways.

For instance, let's say I have properties of type `ChoiceProperty`. A choice is a property that can take one value
within a given set of values.

```
ChoiceProperty my_choice({"easy", "normal", "hard"}, "easy"); // creates choice with the possibilities and the default
my_choice.value("hard"); // assigns the given value to this choice (if this choice exists)
std::cout << my_choice.value() << std:endl; // prints the current value of choice (here "hard")
```

Unfortunately, `boost::any` doesn't allow to specify how to initialize, get or set the value. It would always assign or
return an instance of `Choice`.

To sum up, the property should:

- not allow to reassign with a value of a different type
- allow to specify how to initialize, get or set the value of the property

## The idea

The concept of `boost::any` is:

- a template constructor (on the value type)
- a "holder" to store the value, and a type_info the store the type information
- a template method to get the value, which cast the holder interface into the real holder type and return the value or
throw a `bad_cast` exception if the template type doesn't match the stored type_info

For our `PropertyPointer` class, the base concept will be the same but with some changes. The main idea is that,
instead of providing a method to directly access to the value, property will have methods to set and get the value.
`PropertyPointer` will be used as follow:

```
auto vec2 = make_property<Vec2Property>(2, 4);
vec2.value<Vec2Property>(Vec2(1, 2));
std::cout << my_choice.value<Vec2Property>().x << std::endl; // displays "1"
```

Moreover, if you try to call the `value()` setter with the wrong template parameter, there will be a
compilation error, and an exception for the `value()` getter.

## Property Base

Since we want to be able to get the real type of value stored in a property, we will ensure that each property
implement the following interface:

```
#pragma once

#include <typeinfo>

class PropertyBase {
public:
    virtual ~PropertyBase() = default;

public:
    virtual auto type_info() const -> std::type_info const & = 0;

protected:
    PropertyBase() = default;
    PropertyBase(PropertyBase const &) = default;

protected:
    auto operator=(PropertyBase const &other) -> PropertyBase & = default;
};
```

## Property Pointer

Now, let's create the property pointer class:
```
#pragma once

#include <memory>
#include <utility>
#include <typeinfo>
#include <type_traits>
#include <stdexcept>
#include "PropertyBase.h"

class PropertyPointer final {
public:
    PropertyPointer() = default;

    // creates the property
    PropertyPointer(std::shared_ptr<PropertyBase> const &value) :
            _value(value) {

    }

    PropertyPointer(PropertyPointer const &) = default;
    ~PropertyPointer() = default;

public:
    auto operator=(PropertyPointer const &other) -> PropertyPointer & = default;
    operator bool() { return !!_value; } // to check whether the property is initialized

public:
    auto type_info() const -> std::type_info const & { return _value->type_info(); };

public:
    template <typename TProperty> auto ptr() const -> TProperty *;
    auto value() const -> ???;
    auto value(??? value) -> void;

private:
    std::shared_ptr<PropertyBase> _value;
};

template <typename TProperty>
auto PropertyPointer::ptr() const -> TProperty * {
    if (typeid(TProperty).hash_code() != _value->type_info().hash_code()) {
        throw std::bad_typeid();
    }
    return std::dynamic_pointer_cast<TProperty>(_value).get();
}

```

As you can see, the class simply store the value into a `shared_ptr` (of type `PropertyBase`), and the template method
`ptr()` returns a shared_ptr of the real type. Now, we have to implement the methods to set and get the value. Each
of these methods will simply call the `value()` methods declared in the stored property.

For the setter, it's easy, you just have to get a pointer of the real type (thanks to `ptr()` method), and call the
value method with the given parameter.

```
template <typename TProperty, typename TValue>
auto PropertyPointer::value(TValue &&value) -> void {
    ptr<TProperty>()->value(std::forward(value));
}
```

For the getter, it's a little more challenging. Indeed, we don't know the return type of the getter. In order to
determine it, we will use `decltype` to declare the type directly from the method's return type:

```
template <typename TProperty>
auto PropertyPointer::value() const -> decltype(std::declval<TProperty>().value()) {
    return ptr<TProperty>()->value();
}

```

Finally, there is one last function to add: `make_property`. This function should be used to instantiate a property
pointer (like `std::make_shared` for `std::shared_ptr`).

```
template <typename TProperty, typename ...TArgs>
auto make_property(TArgs && ...args) -> PropertyPointer {
    return PropertyPointer(std::make_shared<TProperty>(std::forward<TArgs>(args)...));
}
```

## Counter Property

The following code is a very simple example of what you can do with this pattern:

```
#pragma once

#include "PropertyBase.h"

class CounterProperty final : public PropertyBase {
public:
    CounterProperty() = delete;
    CounterProperty(int start) :
        _count(start) {

    }

    CounterProperty(CounterProperty const &other) = default;
    CounterProperty(CounterProperty &&other) = default;
    ~CounterProperty() = default;

public:
    auto operator=(CounterProperty const &other) -> CounterProperty & = default;
    auto operator=(CounterProperty &&other) -> CounterProperty & = default;

public:
    virtual auto type_info() const -> std::type_info const & override final { return typeid(CounterProperty); }

public:
    auto value() -> int { return _count--; }

private:
    int _count;
};
```
