
#include "testy.hpp"
#include "function.hpp"
#include "callable.hpp"

Suite("Functions tricks", {

  describe("Callable",

    it("Should create an empty callable and call it",
      auto cb = makeCallable([] () {});
      cb.call();
    ),

    it("Should create and call a callable with arguments",
      int i = 0;
      auto cb = makeCallable([&i] (int a, int b, int c) {
        i += a + b + c;
      }, 1, 2, 3);
      test(i == 0);
      cb.call();
      test(i == 6);
    ),

    it("Should work in operator() as well",
      int i = 0;
      auto cb = makeCallable([&i] (float value) {
        i += value;
      }, 5);
      cb();
      cb();
      test(i == 10);
    )

  )

  describe("Function",

    it("Should create and call a simple function.",
      int i = 0;
      Function add = [&] (int value) {
        i += value;
      };
      add(1);
      add(1);
      add(1);
      test(i == 3);
    ),

    it("Should create and call a function with referenced parameters",
      int i = 5;
      Function add = [] (int &param, int value) {
        param += value;
      };
      add(i, 5);
      test(i == 10);
    ),

    it("Should create and call a function with return type",
      Function add = [] (double a, double b) {
        return a + b;
      };
      // c++ inference doesnt work on return type :(
      test(add.call<double>(1.0, 0.2) == 1.2);
    )

  )

})