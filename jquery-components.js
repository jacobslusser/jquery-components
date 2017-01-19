(function ($) {
    'use strict';

    var registry = {};
    var dataKey = 'component';

    function resolveTemplate(name, template) {
        var $el;

        if ($.type(template) === 'string') {
            // HTML string
            $el = $(template);
        } else if ('selector' in template) {
            $el = $(template.selector);

            // Get the children
            switch ($el.prop('tagName')) {
                case 'SCRIPT':
                    // Parse the script contents
                    $el = $($el.html().trim());
                    break;
                case 'TEXTAREA':
                    // Parse the textarea contents
                    $el = $($el.val().trim());
                    break;
                case 'TEMPLATE':
                    // Get document fragment and fall through
                    $el = $($el.prop('content'));
                default:
                    // Clone the children
                    $el = $el.children().clone();
                    break;
            }
        } else if ('element' in template) {
            // Clone the DOM/jQuery children
            $el = $(template.element).children().clone();
        } else {
            throw Error("Invalid template value for component '" + name + "': " + template + ".");
        }

        return $el;
    }

    function resolveViewModel(name, viewModel, $template, params, $el) {
        var vm;

        if ($.type(viewModel) === 'function') {
            // Constructor function
            vm = new viewModel($template, params);
        }
        else if ('instance' in viewModel) {
            // Static instance
            vm = viewModel.instance;
        } else if ('factory' in viewModel) {
            // Factory
            var componentInfo = {
                name: name,
                $element: $el
            };
            vm = viewModel.factory($template, params, componentInfo);
        } else {
            throw Error("Invalid viewModel value for component '" + name + "': " + viewModel + ".");
        }

        return vm;
    }

    $.extend({
        components: (function () {

            function isRegistered(name) {
                return registry.hasOwnProperty(name);
            }

            function register(name, config) {
                if (!config) {
                    throw new Error("Invalid configuration for component '" + name + "'.");
                }

                if (isRegistered(name)) {
                    throw new Error("The '" + name + "' component is already registered.");
                }

                registry[name] = config;
            }

            function unregister(name) {
                delete registry[name];
            }

            return {
                register: register,
                isRegistered: isRegistered,
                unregister: unregister
            };
        } ())
    });

    $.fn.extend({
        component: function (name, params) {
            if (!$.components.isRegistered(name)) {
                throw new Error("There is no '" + name + "' component registered.");
            };

            var config = registry[name];
            var $template = resolveTemplate(name, config.template);

            // Chaining
            return this.each(function () {
                var $this = $(this);
                var viewModel;

                // Remove previous
                var previousViewModel = $this.data(dataKey);
                if (previousViewModel) {
                    if ('beforeRemove' in previousViewModel && $.type(previousViewModel.beforeRemove) === 'function') {
                        previousViewModel.beforeRemove();
                    }

                    $this.removeData(dataKey);
                }

                if (config.viewModel) {
                    // View model is optional
                    viewModel = resolveViewModel(name, config.viewModel, $template, params, $(this));
                }

                // Inject
                $this.empty().append($template).data(dataKey, viewModel);

                // Callback
                if (viewModel && 'afterAppend' in viewModel && $.type(viewModel.afterAppend) === 'function') {
                    viewModel.afterAppend();
                }
            });
        }
    });

} (jQuery));
