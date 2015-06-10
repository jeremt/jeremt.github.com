## The problem

In C++ there is no simple way to store values of different classes in the same base class. Let's say for example that
you want to store a container of properties but each property can either be a boolean, a string or even a color. You
would use something like that:

```
std::unordered_map<std::string, Property> my_properties;
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

Moreover, when you try to get a value of the wrong type, an exception is thrown:

```
boost::any_cast<int>(m["basic_red"]); // throws
```

For this particular use case, I also would like to specify the way to set or get the value of the class. Indeed, for
some properties, I would like to initialize, get or set the property's value in different ways.

For instance, let's say I have properties of type `Choice`. A choice is a property that can take one value within a
given set of values.

```
Choice my_choice({"easy", "normal", "hard"}, "easy"); // creates the choice with the possibles value and the default one
my_choice.value("hard"); // assigns the given value to this choice (if this choice exists)
std::cout << my_choice.value() << std:endl; // prints the current value of choice (here "hard")
```

Unfortunately, `boost::any` doesn't allow to specify how to initialize, get or set the value. It would always assign or
return an instance of `Choice`.

To sum up, the `Property` class that I need, should:

- not allow to reassign with a value of a different type
- has error at compile time when we try to assign or get a value with an invalid type
- allow to specify how to initialize, get or set the value of the property

## The idea

The rough idea behind `boost::any` is:

- a template constructor (on the value type)
- a "holder" to store the value, and a type_info the store the type information
- a template method to get the value, which cast the holder interface into the real holder type and return the value or
throw a `bad_cast` exception if the template type doesn't match the stored type_info

For `Property`, the base concept will be the same but with some changes. The main idea is that, instead of providing
a method to directly access to the value, property will have methods to set and get the value. `Property` will be used
as follow:

```
Property my_choice(new Choice({"easy", "normal", "hard"}, "easy"));

my_choice.value<Choice>("hard");
std::cout << my_choice.value<Choice>() << std::endl; // displays "hard"
```

Moreover, if you try to call one of the `value()` methods with the wrong template parameter, there will be a
compilation error.

## Property

Since we want to be able to get the real type of value stored in a property, we will ensure that each property
implement the following interface:

```
class ValueBase {
public:
    virtual ~ValueBase() = default;

public:
    // this method should be implemented be subclasses to return the type hash_code of the value
    virtual size_t hash_code() const = 0;

protected:
    ValueBase() = default;
    ValueBase(ValueBase const &other) = default;

protected:
    ValueBase &operator=(ValueBase const &other) = default;
};
```

Now, let's create the property class:
```
class Property {
public:

    // Default a copy constructors
    Property() = default;
    Property(Property const &) = default;

    // Stores the given value pointer into the property
    Property(ValueBase *value)
            : _value(value) {

    }


public:
    // Default assignation operator
    Property &operator=(Property const &other) = default;

public:
    // Returns the hash_code of the contained value
    size_t hash_code() const { return _value->hash_code(); }

    // Casts the contained value in a pointer of the real type
    template<typename ValueType> std::shared_ptr<ValueType> ptr() const {
        return std::dynamic_pointer_cast<ValueType>(_value);
    }

    // Setter
    void value(???);

    // Getter
    ??? value() const;

private:
    std::shared_ptr<ValueBase> _value;
};
```

As you can see, the class simply store the value into a `shared_ptr` (of type `ValueBase`), and the template method
`ptr()` returns a shared_ptr of the real type. Now, we have to implement the methods to set and get the value. Each
of these methods will simply call the `value()` methods declared in the stored value (in `Choice` for example).

For the setter, it's easy, you just have to get a pointer of the real type (thanks to `ptr()` method), and call the
value method with the given parameter.

```
    template<typename ValueType, typename Type>
    void value(Type &&value) {
        ptr<ValueType>()->value(std::move(value));
    }
```

For the getter, it's a little more challenging. Indeed, we don't know the return type of the getter. In order to
determine it, we will use `decltype` to declare the type directly from the method's return type:

```
    template<typename ValueType>
    auto value() const -> decltype(std::declval<ValueType>().value()) {
        return ptr<ValueType>()->value();
    }
```

And that's it, the `Property` class is finished! Now, we need to write our `Choice` class to test it. It simply has
the following requirements to work with `Property`:

- inheriting from `ValueBase` and implementing `hash_code()`
- having a `value()` method which returns something and takes no parameter
- having a `value()` method which takes one parameter and returns void

```
class Choice : public ValueBase {
public:
    Choice(std::initializer_list<std::string> choices, std::string const &default_choice)
            : _choices(choices),
              _current_choice(default_choice) {

    }

    void value(std::string &&choice) {
        auto it = std::find(_choices.begin(), _choices.end(), std::move(choice));
        assert(it != _choices.end());
        _current_choice = *it;
    }

    std::string const &value() const {
        return _current_choice;
    }

    virtual size_t hash_code() const final {
        return typeid(Choice).hash_code();
    }

private:
    std::vector<std::string> _choices;
    std::string _current_choice;

};
```

## Value of any type

So, it's cool that you can use property with your own class, but what if you need to create property we build-in types
or classes that already exists?

Instead of creating a new class for each new type, you can easily use the following helper to create properties of
any type:

```
template<typename Type>
class Value final : public ValueBase {
public:
    Value() = delete;
    Value(Type const &value);
    Value(Type &&value);
    Value(Value const &other) = default;
    ~Value() = default;

public:
    Value &operator=(Value const &other) = default;
    bool operator!=(Value const &other) const;

public:
    Type const &value() const { return _value; }
    void value(Type &&value) { _value = std::move(value); }

public:
    virtual size_t hash_code() const final { return typeid(Value<Type>).hash_code(); }

private:
    Type _value;
};

template<typename Type>
Value<Type>::Value(Type const &value) :
        _value(value) {

}

template<typename Type>
Value<Type>::Value(Type &&value) :
        _value(std::move(value)) {

}

template <typename Type>
bool Value<Type>::operator!=(Value const &other) const{
    return (_value != other._value);
}

typedef Value<bool> Boolean;
typedef Value<float> Number;
typedef Value<std::string> String;
```

### Example

```
std::unordered_map<std::string, Property> my_properties;

my_properties["boolean_value"] = new Boolean(true);
my_properties["string_value"] = new String(std::string("Some string value..."));
my_properties["custom_object"] = new Value<CustomObject>(CustomObject());
```

## Value From This

Now, let's say that you create a class that you want to use with `Property`. However, unlike `Choice`, you don't want
to add specific behavior, you just want to set and get the instance of the class when calling `Property`'s setter and
getter. Instead of implementing `value()` and `hash_code()` manually, you can directly inherit from the following
class:

```
template<typename Type>
class ValueFromThis : public ValueBase {
public:
    ValueFromThis() = default;
    ValueFromThis(ValueFromThis const &other) = default;
    virtual ~ValueFromThis() = default;

public:
    ValueFromThis &operator=(ValueFromThis const &other) = default;

public:
    Type const &value() const { return *static_cast<Type const *>(this); }
    Type &value() { return *static_cast<Type *>(this); }
    void value(Type &&value) { *this = std::move(value); }

public:
    virtual size_t hash_code() const final { return typeid(Type).hash_code(); }
};
```

### Example

```
class Vec2 final : public ValueFromThis<Vec2> {
public:
    Vec2(int x, int y)
            : x(x),
              y(y) {

    }

public:
    int x;
    int y;
};


int main(int, char **) {
    Property my_point(new Vec2(2, 3));

    std::cout << my_point.value<Vec2>().x << ", " << my_point.value<Vec2>().y << std::endl;
    return 0;
}
```
