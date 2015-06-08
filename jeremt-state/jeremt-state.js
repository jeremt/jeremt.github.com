/**
 `jeremt-state` is an element in which 1 child element can be active at the time. More precisely,
 the element which match the `currentState` attribute of the `jeremt-state` has the class
 `activeClass` while the other don't.
 Example:
 <jeremt-state root-state="root" current-state="{{_currentState}}">
     <div>Page 1</div>
     <div>Page 2</div>
     <div>Page 3</div>
 </jeremt-state>
 If you don't specify `rootState` attribute, no element will be active by default.
*/
Polymer({
    is: "jeremt-state",
    properties: {

        /**
         * The element that should be active by default.
         *
         * @attribute rootState
         * @type {String}
         */
        rootState: {
            type: String,
            value: null
        },

        /**
         * The state of the element currently active, whenever this value change, the active class
         * of all elements will be updated.
         *
         * @attribute currentState
         * @type {String}
         */
        currentState: {
            type: String,
            observer: '_stateChanged'
        },

        /**
         * If you want to use another attribute that `data-state` for specifying the state of an
         * element, set this attribute to another value.
         *
         * @attribute attrForState
         * @type {String}
         */
        attrForState: {
            type: String,
            value: "data-state"
        },

        /**
         * The class to set on elements when active.
         *
         * @attribute activeClass
         * @type {String}
         */
        activeClass: {
            type: String,
            value: "active-state"
        }
    },

    /**
     * Resets the current state to the root state.
     */
    reset: function () {
        this.currentState = this.rootState;
    },

    ready: function () {
        if (this.rootState !== null) {
            this.currentState = this.rootState;
        }
    },

    _stateChanged: function () {
        var nodes = Polymer.dom(this).queryDistributedElements("[" + this.attrForState + "]");
        for (var i = 0; i < nodes.length; ++i) {
            var isSelected = nodes[i].attributes[this.attrForState].value === this.currentState;
            this.toggleClass(this.activeClass, isSelected, nodes[i]);
        }
    }

});