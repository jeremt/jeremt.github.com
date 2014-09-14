var ContactCtrl, HomeCtrl, LabCtrl, app;

app = angular.module("app", ["ngRoute", "ui.ace"]);

app.config([
  "$routeProvider", function(route) {
    return route.when("/", {
      templateUrl: "app/home.html",
      controller: "HomeCtrl"
    }).when("/lab", {
      templateUrl: "app/lab.html",
      controller: "LabCtrl"
    }).when("/lab/:name", {
      templateUrl: "app/lab_article.html",
      controller: "LabCtrl"
    }).when("/contact", {
      templateUrl: "app/contact.html",
      controller: "ContactCtrl"
    }).otherwise({
      redirectTo: "/"
    });
  }
]);

HomeCtrl = (function() {
  var QUOTES;

  HomeCtrl.$inject = ["$scope"];

  QUOTES = ["\"If debugging is the process of removing software bugs, then programming must be the process of putting them in.\" - Edsger Dijkstra", "\"Measuring programming progress by lines of code is like measuring aircraft building progress by weight.\" - Bill Gates", "\"C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do, it blows away your whole leg.\" - Bjarne Stroustrup", "\"When debugging, novices insert corrective code; experts remove defective code.\" - Richard Pattis", "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" - Martin Fowler", "\"Before software can be reusable it first has to be usable.\" - Ralph Johnson"];

  function HomeCtrl(scope) {
    this.scope = scope;
    this.scope.resumeUrl = "https://docs.google.com/document/d/" + "1o_tesZvLk8ptZLTAp94PbY6uaRWE1ztGSL3LrxOU468/edit?usp=sharing";
    this.scope.quote = QUOTES[~~(Math.random() * QUOTES.length)];
  }

  return HomeCtrl;

})();

app.controller("HomeCtrl", HomeCtrl);

LabCtrl = (function() {
  var ARTICLES;

  LabCtrl.$inject = ["$scope", "$routeParams"];

  ARTICLES = {
    "cpp11_functions_tricks": "C++11 functions tricks",
    "glsl_antialiasing_techniques": "GLSL anti-aliasing techniques"
  };

  function LabCtrl(scope, params) {
    this.scope = scope;
    this.params = params;
    this.scope.onEditor = function(editor) {
      return editor.setReadOnly(true);
    };
    this.scope.name = this.params.name;
    this.scope.articles = ARTICLES;
  }

  return LabCtrl;

})();

ContactCtrl = (function() {
  ContactCtrl.$inject = ["$scope"];

  function ContactCtrl(scope) {
    this.scope = scope;
  }

  return ContactCtrl;

})();

app.controller("ContactCtrl", ContactCtrl);

app.directive("btn", function() {
  return {
    restrict: "E",
    replace: true,
    scope: {
      icon: "@"
    },
    template: "<a class=\"btn fa fa-{{icon}}\"></a>"
  };
});

app.directive("card", function() {
  return {
    restrict: "E",
    replace: true,
    scope: {
      href: "@",
      icon: "@",
      title: "@"
    },
    template: "<a target=\"{{isExternal() ? '_self' : '_blank'}}\" class=\"card\">\n  <div>\n    <span class=\"fa fa-{{icon}}\"></span>\n  </div>\n</a>",
    link: function(scope) {
      return scope.isExternal = function() {
        return scope.href.indexOf("http://") === 0 || scope.href.indexOf("https://");
      };
    }
  };
});
