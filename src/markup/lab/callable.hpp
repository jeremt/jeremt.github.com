
#pragma once

#include <tuple>
#include <cstddef>
#include <memory>

namespace priv {

template<size_t Count>
struct CallableHelper {
  template<typename Lambda, typename First, typename ...Args>
  void operator()(Lambda const &lambda, First &&first, Args &&...args) const {
    CallableHelper<Count - 1>()(lambda, first, std::get<Count - 1>(first),
        std::forward<Args>(args)...);
  }
};

template<>
struct CallableHelper<0> {
  template<typename Lambda, typename First, typename ...Args>
  void operator()(Lambda const &lambda, First &&, Args &&...args) const {
    lambda(std::forward<Args>(args)...);
  }
};

}

template<typename Lambda, typename ...Args>
struct Callable {
public:

  Callable(Lambda const &lambda, Args &&...args) :
    _args(std::forward<Args>(args)...),
    _lambda(lambda) {
  }

  ~Callable() {}

  void call() {
    priv::CallableHelper<sizeof...(Args)>()(_lambda, _args);
  }

  void operator()() {
    call();
  }

private:
  std::tuple<Args...> _args;
  Lambda _lambda;
};

// Create the callable. It's a function so the template parameters shouldn't
// be specified.
template<typename Lambda, typename ...Args>
Callable<Lambda, Args...> makeCallable(Lambda &&lambda, Args &&...args) {
  return Callable<Lambda, Args...>(lambda, std::forward<Args>(args)...);
}
