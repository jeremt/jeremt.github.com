Polymer({
    is: "jeremt-card-button",
    properties: {
        icon: String,
        description: String,
        target: String
    },
    ready: function () {
        if (this.icon) {
            this.toggleClass(this.icon, true, this.$.icon);
        } else {
            this.toggleAttribute("hidden", true, this.$.icon);
        }
        this.$.card.addEventListener("click", function () {
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