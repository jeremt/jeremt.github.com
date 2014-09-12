#pragma once

#include <list>
#include <unordered_map>
#include <string>
#include <iostream>
#include <iomanip>
#include <chrono>
#include <functional>
#include <unistd.h>

/**
 * @namespace testy
 * Simple tool to easly manage unit tests.
 */
namespace testy {

/**
 * @macro Suite
 * The macro used to create the test suite.
 */
#define Suite(name, code) \
  int main() { \
    testy::TestSuite testSuite(name); \
    code \
    return testSuite.run(); \
  }

/**
 * @macro describe
 * Describe one entity of the suite.
 */
#define describe(name, ...) \
  testSuite.addTest(name, { \
    __VA_ARGS__ \
  });

/**
 * @macro example
 */
#define example(name, ...) \
  testSuite.addExample(name, [&] () { \
    __VA_ARGS__ \
  });

/**
 * @macro it
 * Test one action of the suite.
 */
#define it(text, ...) \
  {text, [&] () { \
      __VA_ARGS__ \
      return ""; \
    }}

/**
 * @macro test
 * Test if the given expr is true.
 */
#define test(expr) if (!(expr)) { return #expr; }

/**
 * @macro testRange
 * Test if the given expr is in the given range.
 */
#define testRange(expr, begin, end) \
  { \
    auto const &val = expr; \
    if (val > end || val < begin) \
      return #expr; \
  }


/**
 * @macro testThrow
 * Test if the given `expr` throw the given `except`.
 */
#define testThrow(expr, except) try { expr } catch (except) {}

/**
 * TestSuite
 * Simple test suite in which you can register units and run all unit tests.
 */
class TestSuite {
 public:
  /**
   * @typedef Unit
   * Describe a unit to test.
   */
  typedef std::list<std::pair<std::string, std::function<std::string()>>> Unit;
  TestSuite(std::string const &name) : _name(name) {}
  ~TestSuite() {}
  inline void displayTitle(std::string const &title);
  inline void displaySubtitle(std::string const &subTitle);
  inline void addTest(std::string const &desc, Unit const &unit);
  inline void addExample(std::string const &, std::function<void()> const &);
  inline int run();
 private:
  std::string _name;
  std::list<std::pair<std::string, Unit>> _tests;
  std::list<std::pair<std::string, std::function<void()>>> _examples;
};

inline void TestSuite::displayTitle(std::string const &title) {
    std::cout << std::endl << "  \e[1m" << title << std::endl;
    std::cout << "  ";
    for (size_t i = 0; i < title.size(); ++i)
      std::cout << "=";
    std::cout << "\e[m"<< std::endl;
}

inline void TestSuite::displaySubtitle(std::string const &subTitle) {
  std::cout << "  \e[m## " << subTitle << std::endl << std::endl;
}

/**
 * Register a new unit test.
 * @param desc The description of this unit.
 * @param unit The unit which contains all tests.
 */
inline void TestSuite::addTest(std::string const &desc,
                               TestSuite::Unit const &unit) {
  _tests.push_back(std::make_pair(desc, unit));
}

/**
 * Register an example, with a simple "classic" output.
 */
inline void TestSuite::addExample(std::string const &desc,
                                  std::function<void()> const &fn) {
  _examples.push_back(std::make_pair(desc, fn));
}

/**
 * Return all unit tests.
 * @return Returns the number of failures or 0 on success.
 */
inline int TestSuite::run() {
  std::chrono::steady_clock::time_point prev;
  int fail = 0;
  int total = 0;
  size_t duration = 0;

  if (!_tests.empty()) {

    displayTitle(_name + "'s tests");
    std::cout << std::endl;
    for (auto &unit : _tests) {

      // Display the test description
      displaySubtitle(unit.first);

      for (auto const &test : unit.second) {

        // Run the test and display the fail or success message

        prev = std::chrono::steady_clock::now();
        std::cout << "    ";
        std::string error;
        try {
          error = test.second();
          if (!error.empty()) { // message isnt empty
            error = "code `" + error + "`";
            ++fail;
            std::cout << "\e[0;31✗ ";
          } else { // succeed otherwise
            std::cout << "\e[0;32m✓ \e[1;30m";
          }
        } catch (std::exception const &e) {
          error = "exception `" + std::string(e.what()) + "`";
          ++fail;
          std::cout << "\e[0;31m✗ ";
        } catch (...) { // fail if an unexpected exception is thrown.
          error = "unknown exception";
          ++fail;
          std::cout << "\e[0;31m✗ ";
        }

        // and duration of the function call

        size_t delta = (std::chrono::steady_clock::now() - prev).count() / 1000;
        duration += delta;
        std::cout << test.first << " ("
                  << std::fixed << delta
                  << "ms)" << std::endl;

        // display error message

        if (!error.empty())
          std::cout << "        failed with " << error << std::endl;

        ++total;
      }
      std::cout << std::endl;

    }

    // Display the result of the tests

    if (fail) {
      std::cout << "  \e[0;31m✗ " << fail << " of "
                << total << " tests failed "
                << "(" << duration << "ms)";
    } else {
      std::cout << "  \e[0;32m✓ " << total
                << " tests completed "
                << "(" << duration << "ms)";
    }
    std::cout << "\e[m" << std::endl << std::endl;
  }

  if (!_examples.empty()) {
    displayTitle(_name + "'s examples");
    std::cout << std::endl;
    for (auto const &example : _examples) {
      displaySubtitle(example.first);
      example.second();
      std::cout << std::endl;
    }
    std::cout << std::endl;
  }

// Wait for keyboard press on windows to keep the output console opened.
#if defined(WIN32) || defined(_WIN32) || defined(__WIN32__)
  std::cout << "  [ Press any key to quit ]" << std::endl << std::endl;
  std::cin.get();
#endif

  return fail;
}

}