Polymer({
    is: "jeremt-app",
    _resumeUrl: "https://docs.google.com/document/d/1o_tesZvLk8ptZLTAp94PbY6uaRWE1ztGSL3LrxOU468/pub",
    _currentPage: "#",
    _contacts: {
        "GITHUB": "https://github.com/jeremt",
        "LINKEDIN": "https://www.linkedin.com/profile/view?id=208391836&trk=nav_responsive_tab_profile",
        "FACEBOOK": "https://www.facebook.com/taboada.jeremie",
        "GOOGLEPLUS": "https://plus.google.com/106788167698511705100/posts",
        "TWITTER": "https://twitter.com/JeremieTaboada",
        "MAIL": "mailto:taboada.jeremie@gmail.com"
    },
    ready: function () {
        this._currentPage = window.location.hash;
        window.addEventListener("hashchange", function () {
            this._currentPage = window.location.hash;
        }.bind(this));
    },
    _articlesClicked: function () {
        window.location.hash = "#articles";
    },
    _resumeClicked: function () {
        window.open(this._resumeUrl);
    },
    _contactClicked: function () {
        window.location.hash = "#contact";
    },
    _closeClicked: function () {
        window.location.hash = "#";
    },
    _linkClicked: function (e) {
        var link = this._contacts[e.srcElement.innerText.trim()];
        if (link !== undefined) {
            if (link.indexOf("mailto:") === 0) {
                window.location.href = link;
            } else {
                window.open(link);
            }
        }
    }
});