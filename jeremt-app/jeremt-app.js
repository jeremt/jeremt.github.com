Polymer({
    is: "jeremt-app",
    _currentPage: "",
    ready: function () {
        this._currentPage = window.location.hash;
        window.addEventListener("hashchange", function () {
            this._currentPage = window.location.hash;
        }.bind(this));
    },
    _isHome: function (currentPage) {
        return currentPage === "";
    }
});