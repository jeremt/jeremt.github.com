Polymer({
    is: "jeremt-card",
    properties: {
        icon: String,
        description: String
    },
    ready: function () {
        this.toggleClass(this.icon, true, this.$.icon);
        this.$.icon.addEventListener("click", function () {
            this.fire("click");
        }.bind(this));
    }
});