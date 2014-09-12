
app = angular.module("app", ["ngRoute", "ui.ace"])

app.config ["$routeProvider", (route) ->
  route
    .when("/",
      templateUrl: "app/pages/home.html"
      controller: "HomeCtrl"
    )
    .when("/lab",
      templateUrl: "app/pages/lab.html"
      controller: "LabCtrl")
    .when("/contact",
      templateUrl: "app/pages/contact.html"
      controller: "ContactCtrl"
    )
    .otherwise(redirectTo: "/")
]

class HomeCtrl

  @$inject = ["$scope"]

  QUOTES = [
    "\"If debugging is the process of removing software bugs, then programming must be the process of putting them in.\" - Edsger Dijkstra"
    "\"Measuring programming progress by lines of code is like measuring aircraft building progress by weight.\" - Bill Gates"
    "\"C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do, it blows away your whole leg.\" - Bjarne Stroustrup"
    "\"When debugging, novices insert corrective code; experts remove defective code.\" - Richard Pattis"
    "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" - Martin Fowler"
    "\"Before software can be reusable it first has to be usable.\" - Ralph Johnson"
  ]

  constructor: (@scope) ->
    @scope.resumeUrl = "https://docs.google.com/document/d/" +
        "1o_tesZvLk8ptZLTAp94PbY6uaRWE1ztGSL3LrxOU468/edit?usp=sharing"
    @scope.quote = QUOTES[~~(Math.random() * QUOTES.length)]

app.controller("HomeCtrl", HomeCtrl)

class LabCtrl

  @$inject = ["$scope"]

  constructor: (@scope) ->
    @scope.onEditor = (editor) ->
      editor.setReadOnly(true)

class ContactCtrl

  @$inject = ["$scope"]

  constructor: (@scope) ->

app.controller("ContactCtrl", ContactCtrl)

app.directive("btn", ->
  restrict: "E"
  replace: true
  scope:
    icon: "@"
  template: """
  <a class="btn fa fa-{{icon}}"></a>
  """
)

app.directive("card", ->
  restrict: "E"
  replace: true
  scope:
    href: "@"
    icon: "@"
    title: "@"
  template: """
  <a target="{{isExternal() ? '_self' : '_blank'}}" class="card">
    <div>
      <span class="fa fa-{{icon}}"></span>
    </div>
  </a>
  """
  link: (scope) ->
    scope.isExternal = ->
      scope.href.indexOf("http://") is 0 or scope.href.indexOf("https://")
)
