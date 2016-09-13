/*
 * On the head set the plugin's name, version, author details and license
 * for example, for example:
 *
 * ------------------------------------------------------------------------
 *
 * jquery-plugin.js Version 0.1
 * jQuery Plugin Boilerplate code helps creating your custom jQuery plugins.
 *
 * Licensed under MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2013 Antonio Santiago
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
(function ($, window, document, undefined) {

    if (!$) {
        console.error("jQuery not found. Please make sure to import jQuery berofe importing the plugin.");
        return false;
    }

    /**
     * Store the plugin name in a variable. It helps you if later decide to
     * change the plugin's name
     */
    var pluginName = 'pin',
        defaults = { // Default options
            fixedOffset: 2, // the header is fixed when it's offset.top minus this offset is equal or less than 0
            fixedClass: "affixed", // class added to header when it should be fixed
            fixedIndex: 2, // this index will be added with a class "index-"
            staticClass: "static", // class added to header when it isn't being handled, fixed to it's container
            resizeTimeout: 80, // sets the timeout to refresh the header's height when resizing the screen
        };

    /**
     * The plugin constructor
     * @param {object} element The DOM element where plugin is applied
     * @param {object} options Options passed to the constructor
     */
    function Plugin(element, options) {

        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference to the source element
        this.$el = $(element);

        // Set the instance options extending the plugin defaults and
        // the options passed by the user
        this.options = $.extend(false, {}, defaults, options);

        // Initialize the plugin instance
        this.init();
    }

    /**
     * Set up your Plugin prototype with desired methods.
     * It is a good practice to implement 'init' and 'destroy' methods.
     */
    Plugin.prototype = {
        /**
         * Initialize the plugin instance.
         * Set any other attribtes, store any other element reference, register
         * listeners, etc
         *
         * When bind listerners remember to name tag it with your plugin's name.
         * Elements can have more than one listener attached to the same event
         * so you need to tag it to unbind the appropriate listener on destroy:
         *
         * @example
         * this.$someSubElement.on('click.' + pluginName, function() {
         *      // Do something
         * });
         *
         */
        init: function () {

            var plugin = this;

            // store the timeout id to refresh the header's height when resizing the screen
            plugin.resizeTimeoutId = false;

            // Creates a container for the source element and stores it.
            plugin.$elContainer = plugin.$el.wrap(function () {
                return "<div id='" + ($(this)[0].id || $(this)[0].className) + "-container'></div>";
            }).parent();

            plugin.refreshContainer();

            $(window).on("resize." + pluginName, function () {
                clearTimeout(plugin.resizeTimeoutId);
                plugin.resizeTimeoutId = false;
                plugin.resizeTimeoutId = setTimeout($.proxy(plugin.refreshContainer, plugin), plugin.options.resizeTimeout);
            });

            /* Affix */
            plugin.refreshAffix($(window).scrollTop());

            $(window).on("scroll." + pluginName, function () {
                plugin.refreshAffix($(window).scrollTop()); // get the offset of the window from the top of page
            });

        },
        /**
         * The 'destroy' method is were you free the resources used by your plugin:
         * references, unregister listeners, etc.
         *
         * Remember to unbind for your event:
         *
         * @example
         * this.$someSubElement.off('.' + pluginName);
         *
         * Above example will remove any listener from your plugin for on the given
         * element.
         */
        destroy: function () {

            // Remove any attached data from your plugin
            this.$el.removeData();

            // Remove Listenners
            $(window).off('resize.' + pluginName);
            $(window).off('scroll.' + pluginName);
        },
        /**
         * @scope Public
         * @description refreshs the height of the $elContainer
         * @returns {void}
         */
        refreshContainer: function () {
            var plugin = this;

            var $clone = plugin.$el.clone().removeClass(plugin.options.fixedClass).css('visibility', 'hidden').appendTo(plugin.$elContainer);

            plugin.$elContainer.css("height", $clone.height() + "px");

            $clone.remove();

            clearTimeout(plugin.resizeTimeoutId);
            plugin.resizeTimeoutId = false;
        },
        /**
         * @author Luiz Filipe Machado Barni (odahcam) <luiz@h2k.com.br>
         * @description refresh the plugin classes used to manage the header
         * @param the window.scrollTop in px
         * @return {null}
         */
        refreshAffix: function (windowScrollTop) {
            this.lastAffixOffset = -1;
            if (this.$el.offset().top - windowScrollTop - this.options.fixedOffset <= 0 && windowScrollTop - this.options.fixedOffset > this.lastAffixOffset) {
                this.lastAffixOffset = this.$el.offset().top;
                this.$el.addClass(this.options.fixedClass + " index-" + this.options.fixedIndex).removeClass(this.options.staticClass);
            } else {
                this.$el.addClass(this.options.fixedClass).removeClass(this.options.fixedClass + " index-" + this.options.fixedIndex);
            }
        },
    };
    /**
     * This is were we register our plugin withint jQuery plugins.
     * It is a plugin wrapper around the constructor and prevents agains multiple
     * plugin instantiation (soteing a plugin reference within the element's data)
     * and avoid any function starting with an underscore to be called (emulating
     * private functions).
     *
     * @example
     * $('#element').jqueryPlugin({
     *     defaultOption: 'this options overrides a default plugin option',
     *     additionalOption: 'this is a new option'
     * });
     */

    /**
     * @author Luiz Filipe Machado Barni <luiz@h2k.com.br>
     * @description This plugin will help you to create a fixed header menu, highlight it's links and smooth scroll when a internal link is clicked.
     * @param {object} options
     *
     * @example
     * $('#element').fixedHeader({
     *     scrollSpy: false
     * });
     */
    $.fn[pluginName] = function (options) {

        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            /*
             * Creates a new plugin instance, for each selected element, and
             * stores a reference withint the element's data
             */
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options !== 'init') {
            /*
             * Call a public plugin method for each selected element and returns this to not break chainbility.
             */
            return this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    return instance[options].apply(instance, Array.prototype.slice.call(args, 1)); // Array.prototype.slice will convert the arguments object
                }
            });
        }
    };

})(window.jQuery || false, window, document);
