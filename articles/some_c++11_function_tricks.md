C++11 provides some features for a more "functional" C++. Indeed, there is some features such as `std::function`,
`std::bind` or lambdas that make functions manipulation much easier. I decided to create 2 useful helpers to manipulate
functions.

The first one stores a lambda and its parameters, then calls it. It is useful when you need to store a function and its
parameters and call it later (like does `std::thread` for instance).

```
auto n = 2;
auto triple = make_callable([] (int &a) {
    a *= 3;
}, n);

triple();
std::cout << n << std::endl;
```

The second stores a lambda in a generic Function type. Then, you can call it after with its parameters via operator().
It's useful to store generic functions in contains (for JS like events for example).

```
Function triple = [] (int &a) {
    a *= 3;
};

int n = 2;
triple(n);
std::cout << n << std::endl;
```

## Callable

The first problem is that the given function can have a variable number of parameters of different type.
That's why we will use variadic templates.


Then, we have to figure out a way to store this parameters within the Callable class. And for this, we have
exactly what we need: `std::tuple`.


Initially, we will create the Callable class, that will store the lambda and its parameters at creation:

```
template<typename TFunction, typename ...TArgs>
class Callable {
public:
    Callable(TFunction &&fn, TArgs &&...args) :
            _fn(std::forward<TFunction>(fn)),
            _args(std::forward<TArgs>(args)...) {
    }

    Callable(Callable const &other) = default;
    Callable(Callable &&other) = default;
    ~Callable() = default;
    
public:
    auto operator=(Callable const &other) -> Callable & = default;
    auto operator=(Callable &&other) -> Callable & = default;

private:
    TFunction _fn;
    std::tuple<TArgs...> _args;
};
```

Now comes the tricky part: we need to call the function with the arguments stored into the tuple.
To do so, there is only one solution: iterate through the template parameters to recreate the arguments
variadic list, then call the lambda. That will be done by the following helper:

```
namespace detail { // private implementation code

    template<size_t TCount>
    struct CallerHelper {
        template<typename TFunction, typename TFirst, typename ...TRest>
        auto operator()(TFunction &&fn, TFirst &&first, TRest &&...rest) const -> void {
            CallerHelper<TCount - 1>()(
                    std::forward<TFunction>(fn),
                    std::forward<TFirst>(first),
                    std::get<TCount - 1>(std::forward<TFirst>(first)),
                    std::forward<TRest>(rest)...);
        }
    };

    template<>
    struct CallerHelper<0> {
        template<typename TFunction, typename TFirst, typename ...TRest>
        auto operator()(TFunction &&fn, TFirst &&, TRest &&...rest) const -> void {
            fn(std::forward<TRest>(rest)...);
        }
    };

}
```

Now, you can easily use the helper is the call operator of the class:

```
#pragma once

#include <tuple>
#include <cstddef>
#include <memory>

namespace detail { // private implementation code

    template<size_t TCount>
    struct CallerHelper {
        template<typename TFunction, typename TFirst, typename ...TRest>
        auto operator()(TFunction &&fn, TFirst &&first, TRest &&...rest) const -> void {
            CallerHelper<TCount - 1>()(
                    std::forward<TFunction>(fn),
                    std::forward<TFirst>(first),
                    std::get<TCount - 1>(std::forward<TFirst>(first)),
                    std::forward<TRest>(rest)...);
        }
    };

    template<>
    struct CallerHelper<0> {
        template<typename TFunction, typename TFirst, typename ...TRest>
        auto operator()(TFunction &&fn, TFirst &&, TRest &&...rest) const -> void {
            fn(std::forward<TRest>(rest)...);
        }
    };

}

/**
 * This class allows to store a function and its parameters to call it later (like in `std::thread` for instance.
 */
template<typename TFunction, typename ...TArgs>
class Callable {
public:
    Callable(TFunction &&fn, TArgs &&...args) :
            _fn(std::forward<TFunction>(fn)),
            _args(std::forward<TArgs>(args)...) {
    }

    Callable(Callable const &other) = default;
    Callable(Callable &&other) = default;
    ~Callable() = default;

public:
    auto operator=(Callable const &other) -> Callable & = default;
    auto operator=(Callable &&other) -> Callable & = default;
    auto operator()() -> void {
        detail::CallerHelper<sizeof...(TArgs)>()(_fn, _args);
    }

private:
    TFunction _fn;
    std::tuple<TArgs...> _args;
};
```

Finally, there is still one problem. You need to specify the template parameters when you create an instance of
callback, which can be annoying to do, especially since the first parameter is a lambda function. In order to
automatically infer these parameters types, we will use the following function instead of creating a callable directly:

```
template<typename TFunction, typename ...TArgs>
auto make_callable(TFunction &&fn, TArgs &&...args) -> Callable<TFunction, TArgs...> {
    return Callable<TFunction, TArgs...>(std::forward<TFunction>(fn), std::forward<TArgs>(args)...);
}
```

## Function

For this one, the problem is that we should store the lambda without knowing its number of paramters or
their types. So we have to find them from the lambda argument itself.

Firstly, we need to convert the lambda to an `std::function`, so we could call it later:

```
namespace detail {

    template <typename TFunction>
    struct FunctionHelper : public FunctionHelper<decltype(&TFunction::operator())> {

    };

    template <typename TClass, typename TReturn, typename ...TArgs>
    struct FunctionHelper<TReturn(TClass::*)(TArgs...) const> {
        using Type = std::function<TReturn(TArgs...)>;
    };

    template <typename TFunction>
    auto make_function(TFunction &fn) -> typename FunctionHelper<TFunction>::Type {
        return static_cast<typename FunctionHelper<TFunction>::Type>(fn);
    }

}
```

Now, we need to store the function into the class in a generic way. While our function doesn't inherit from a specific
object, the only way to do so is to use a `void *` pointer. However, since we will loose the type, we also need to
define the following functions to interact with our function pointer:

- clone, to allocate a new function pointer with the same signature
- delete, to delete the function pointer

```
class Function {
public:

    // everything is null by default, call the function will throw an exception in that case
    Function() :
            _clone([](){ return std::make_pair(nullptr, nullptr); }),
            _delete([](Function *){}),
            _function(nullptr),
            _signature(nullptr) {
    }

    // Here we define our functions and initialize our `_function` pointer and `_signature` type info
    template<typename TFunction>
    Function(TFunction const &fn) {
        _clone = [&] () {
            auto function = new decltype(detail::make_function(fn))(detail::make_function(fn));
            return std::make_pair(static_cast<void *>(function), &typeid(function));
        };
        _delete = [&] (Function *self) {
            if (_function != nullptr) {
                delete static_cast<decltype(detail::make_function(fn)) *>(self->_function);
            }
        };
        auto cloned_function = _clone();
        _function  = cloned_function.first;
        _signature = cloned_function.second;
    }

    // In that case, we use the `_clone` function to create a signature
    Function(Function const &other) :
            _clone(other._clone),
            _delete(other._delete) {
        auto cloned_function = _clone();
        _function  = cloned_function.first;
        _signature = cloned_function.second;
    }

    // Here we call the `_delete` method on the 
    ~Function() {
        _delete(this);
    }

public:
    // Same as copy constructor
    auto operator=(Function const &other) -> Function & {
        if (this != &other) {
            _clone = other._clone;
            _delete = other._delete;
            auto cloned_function = _clone();
            _function  = cloned_function.first;
            _signature = cloned_function.second;
        }
        return *this;
    }

private:

    std::function<std::pair<void *, std::type_info const *>()> _clone;
    std::function<void(Function *self)> _delete;
    void *_function;
    std::type_info const *_signature;

};

```

Then, there is the last step: call the function with the given arguments from the `void *` stored in the class.

```
    template<typename TReturn = void, typename ...TArgs>
    auto call(TArgs &&...args) -> TReturn {
        if (_function == nullptr || _signature == nullptr)
            throw std::logic_error("Call of uninitialized function");
        auto function = static_cast<std::function<TReturn(TArgs...)>*>(_function);
        if (typeid(function) != *(_signature))
            throw std::logic_error("Signatures " + std::string(typeid(function).name()) +
                                           "and" + std::string(_signature->name()) + " mismatch");
        return (*function)(std::forward<TArgs>(args)...);
    }
```

Finally, we put it all together:

```
#pragma once

#include <functional>
#include <stdexcept>
#include <typeinfo>

namespace detail {

    template <typename TFunction>
    struct FunctionHelper : public FunctionHelper<decltype(&TFunction::operator())> {

    };

    template <typename TClass, typename TReturn, typename ...TArgs>
    struct FunctionHelper<TReturn(TClass::*)(TArgs...) const> {
        using Type = std::function<TReturn(TArgs...)>;
    };

    template <typename TFunction>
    auto make_function(TFunction &fn) -> typename FunctionHelper<TFunction>::Type {
        return static_cast<typename FunctionHelper<TFunction>::Type>(fn);
    }

}

/**
 * This class is a generic type to store fns. It's basically the same principe as boost::any design pattern
 * applied on fn functions. You can store the fn without specify any type information, and call it later. It
 * can be useful to store fn functions with different signatures into a map for example.
 */
class Function {
public:

    Function() :
            _clone([](){ return std::make_pair(nullptr, nullptr); }),
            _delete([](Function *){}),
            _function(nullptr),
            _signature(nullptr) {
    }

    template<typename TFunction>
    Function(TFunction const &fn) {
        _clone = [&] () {
            auto function = new decltype(detail::make_function(fn))(detail::make_function(fn));
            return std::make_pair(static_cast<void *>(function), &typeid(function));
        };
        _delete = [&] (Function *self) {
            if (_function != nullptr) {
                delete static_cast<decltype(detail::make_function(fn)) *>(self->_function);
            }
        };
        auto cloned_function = _clone();
        _function  = cloned_function.first;
        _signature = cloned_function.second;
    }

    Function(Function const &other) :
            _clone(other._clone),
            _delete(other._delete) {
        auto cloned_function = _clone();
        _function  = cloned_function.first;
        _signature = cloned_function.second;
    }

    ~Function() {
        _delete(this);
    }

public:
    auto operator=(Function const &other) -> Function & {
        if (this != &other) {
            _clone = other._clone;
            _delete = other._delete;
            auto cloned_function = _clone();
            _function  = cloned_function.first;
            _signature = cloned_function.second;
        }
        return *this;
    }

    // We have to provide a call method, because the return type cannot be found. This operator only works with
    // functions which return void.
    template<typename ...TArgs>
    auto operator()(TArgs &&...args) -> void {
        call(std::forward<TArgs>(args)...);
    }

public:
    template<typename TReturn = void, typename ...TArgs>
    auto call(TArgs &&...args) -> TReturn {
        if (_function == nullptr || _signature == nullptr)
            throw std::logic_error("Call of uninitialized function");
        auto function = static_cast<std::function<TReturn(TArgs...)>*>(_function);
        if (typeid(function) != *(_signature))
            throw std::logic_error("Signatures " + std::string(typeid(function).name()) +
                                           "and" + std::string(_signature->name()) + " mismatch");
        return (*function)(std::forward<TArgs>(args)...);
    }

private:
    std::function<std::pair<void *, std::type_info const *>()> _clone;
    std::function<void(Function *self)> _delete;
    void *_function;
    std::type_info const *_signature;

};
```