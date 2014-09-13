
#pragma once

#include <functional>
#include <stdexcept>
#include <typeinfo>

namespace priv {

template <typename Lambda>
struct FunctionHelper
  : public FunctionHelper<decltype(&Lambda::operator())>
{};

template <typename Class, typename Return, typename ...Args>
struct FunctionHelper<Return(Class::*)(Args...) const> {
  typedef std::function<Return(Args...)> FuncType;
};

template <typename Lambda>
typename FunctionHelper<Lambda>::FuncType makeFunction(Lambda& lambda) {
  return static_cast<typename FunctionHelper<Lambda>::FuncType>(lambda);
}

}

// Generic function type to store lambdas. It's basically the same principe as
// boost::any design pattern applied on lamdas. You can store the lambda
// without specify any type information, and call it later.
class Function {
public:

  // Create an uninitialized function, it should be initialized by assignation
  // operator later.
  Function()
  : _function(NULL)
  , _signature(NULL) {}

  // Create a function from the given `lambda`.
  template<typename Lambda>
  Function(Lambda const &lambda) {
    auto function = new decltype(priv::makeFunction(lambda))
                                (priv::makeFunction(lambda));
    _function  = static_cast<void*>(function);
    _signature = &typeid(function);
    _deleter = [&] () {
      delete static_cast<decltype(priv::makeFunction(lambda)) *>(_function);
    };
  }

  ~Function() {
    _deleter();
  }

  // Execute the function with the given `args`. If the function returns a
  // value, you should specify its return type in template parameters.
  // If the function isn't initialized or its signature doesn't match the
  // arguments, and exception will be thrown.
  template<typename ReturnType = void, typename ...Args>
  ReturnType call(Args &&...args) {
    if (_function == NULL || _signature == NULL)
      throw std::runtime_error("Call of uninitialized function.");
    auto function = static_cast<std::function<ReturnType(Args...)>*>(
      _function);
    if (typeid(function) != *(_signature))
      throw std::bad_cast();
    return (*function)(std::forward<Args>(args)...);
  }

  // Shortcut to call the function. However, this way doesnt support return
  // type.
  template<typename ...Args>
  void operator()(Args &&...args) {
    call(std::forward<Args>(args)...);
  }

private:

  void *_function;
  std::type_info const *_signature;
  std::function<void()> _deleter;

};