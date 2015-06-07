Polymer({
    is: "jeremt-app",
    _resumeUrl: "https://docs.google.com/document/d/1o_tesZvLk8ptZLTAp94PbY6uaRWE1ztGSL3LrxOU468/pub",
    _articlesClicked: function () {
        console.log("articles clicked!");
    },
    _resumeClicked: function () {
        window.open(this._resumeUrl);
    },
    _aboutClicked: function () {
        console.log("about clicked!");
    }
});