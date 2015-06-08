Polymer({
    is: "jeremt-app",
    _resumeUrl: "https://docs.google.com/document/d/1o_tesZvLk8ptZLTAp94PbY6uaRWE1ztGSL3LrxOU468/pub",
    _currentPage: "home",
    _articlesClicked: function () {
        this._currentPage = "articles";
    },
    _resumeClicked: function () {
        window.open(this._resumeUrl);
    },
    _aboutClicked: function () {
        this._currentPage = "about";
    },
    _closeClicked: function () {
        this._currentPage = "home";
    }
});