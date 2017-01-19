# jQuery Components
Somewhere between a basic jQuery enhanced page and a full-blown Angular website lives a area that jquery-components hopes to fill.
For those that want to roll their own SPA website and just want an easier way to make resuable bits of functionality, jquery-components might be for you.

This project is still in **Alpha** stage right now, but I wanted to get the code out there early. Please forgive the mess.

# Background
The patterns used in `jquery-components` are similar to the component support in KnockoutJS.

# Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>jQuery Components Sample</title>
</head>
<body>
    <h1>Hello jQuery Components</h1>
    <div id="component"></div>

    <script type="text/template" id="comp1">
        <h1>Component 1</h1>
        <button>Click Me!</button>
    </script>

    <script type="text/template" id="comp2">
        <h1>Component 2</h1>
    </script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="jquery-components.js"></script>
    <script>
        // Comp1 View Model
        function Comp1($el) {
            // $el is a jQuery object of the component being inserted
            this.afterAppend = function () {
                // Automatically called when the component is appended to the DOM
            };
            this.beforeRemove = function () {
                // Automatically called when the component is about to be removed from the DOM (disposed)
            }

            // Within the component, do any jQuery you want.
            $el.click(function () {
                // Bind the '#component' div to component 2
                $('#component').component('comp2');
            });
        }

        // Register components
        $.components.register('comp1', {
            viewModel: Comp1,
            template: { selector: '#comp1' }
        });

        $.components.register('comp2', {
            template: { selector: '#comp2' }
        });

        // Bind component 1
        $('#component').component('comp1');

    </script>
</body>
</html>
```

Components are registered using the `$.components.register` function and a template and view model are specified. Then using the `$().component()` function on a host element, the template is cloned, passed to a new view model instance, and then injected into the DOM.

More documentation to come.

## License

The MIT License (MIT)

Copyright (c) 2017 Jacob Slusser, https://github.com/jacobslusser

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
