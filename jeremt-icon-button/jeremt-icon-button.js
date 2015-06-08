Polymer({
    is: "jeremt-icon-button",
    properties: {
        icon: String
    },
    ready: function () {
        this.toggleClass(this.icon, true, this.$["icon-button"]);
        this.$["icon-button"].addEventListener("click", function () {
            this.fire("click");
        }.bind(this));
    }
});