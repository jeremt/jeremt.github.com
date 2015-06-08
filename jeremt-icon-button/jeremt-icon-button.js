Polymer({
    is: "jeremt-icon-button",
    properties: {
        icon: String,
        target: String
    },
    ready: function () {
        this.toggleClass(this.icon, true, this.$["icon-button"]);
        this.$["icon-button"].addEventListener("click", function () {
            if (this.target) {
                if (/^https?:\/\//.test(this.target)) {
                    window.open(this.target);
                } else if (/^#/.test(this.target)) {
                    window.location.hash = this.target;
                } else {
                    window.location.href = this.target;
                }
            } else {
                this.fire("click");
            }
        }.bind(this));
    }
});