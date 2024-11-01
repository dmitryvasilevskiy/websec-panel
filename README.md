Laravel 5 admin panel template
==============================

Installation
------------
This package is very easy to set up. There are only couple of steps.

Composer
--------
Pull this package in through Composer (file composer.json).

    {
        "require": {
            "websecret/panel": "dev-master"
        }
    }

Run this command inside your terminal.

    composer update


Service Provider
----------------

Add the package to your application service providers in config/app.php file.

    'providers' => [
        Websecret\Panel\PanelServiceProvider::class,
        Spatie\Glide\GlideServiceProvider::class,
    ],

    'aliases' => [
        'FormHelper' => Websecret\Panel\FormHelperFacade::class,
        'GlideImage' => Spatie\Glide\GlideImageFacade::class,
    ],
    

Views, Assets, Models
----------------

Publish the package views and assets to your application. Run these commands inside your terminal.

    php artisan vendor:publish --provider="Websecret\Panel\PanelServiceProvider" --tag=config
    php artisan vendor:publish --provider="Websecret\Panel\PanelServiceProvider" --tag=migrations
    php artisan vendor:publish --provider="Websecret\Panel\PanelServiceProvider" --tag=models
    php artisan vendor:publish --provider="Websecret\Panel\PanelServiceProvider" --tag=commands
    php artisan vendor:publish --provider="Websecret\Panel\PanelServiceProvider" --tag=views
    php artisan vendor:publish --provider="Websecret\Panel\PanelServiceProvider" --tag=assets
    php artisan vendor:publish --provider="Spatie\Glide\GlideServiceProvider"

Use `--force` to overwrite files

Usage
=====

Helpers.js
-------

Classes
-------
`.js_panel_form-ajax` - forms will be submited by AJAX. U can use `.js_panel_form-ajax-redirect` to redirect on repsonse data.link page

`.js_panel_delete` - attach prompt (y/n) popup on delete action. U can use `js_panel_delete-table-row` or `data-delete`. Default deleting parent element

`.js_panel_input-date`  - use for init [bootsrap datepicker](https://bootstrap-datepicker.readthedocs.org/) on input 

`.js_panel_input-time` - use for init [bootstrap timicker](http://jdewit.github.io/bootstrap-timepicker/) on input 
 
 `.js_panel_input-mask` - use for init mask on input via input `data-mask` attribute
 
 `.js_panel_input-phone` - working same as .js_panel_input-mask. Mask is  '+375 (99) 999-99-99'
 
 `.js_panel_input-chosen` - use it on selects to init [chosen](https://harvesthq.github.io/chosen/)
 
 `.js_panel_input-select2` - use it on selects to init 
 
 `.js_panel_input-redactor` - use it to init [redactor.js](https://imperavi.com/redactor/) wysiwyg
 
 `.js_panel_datatable` - use it to init [Datatables](https://www.datatables.net/). Use `data-datatable-order` ('asc', 'desc', false) on `thead th` to set column order. Use `data-datatable-search` (true, false) on `thead th` to set column searching. 

Functions
---------

`showNotification(text, title, type)`

Events
------
`panel-form-ajax-submitted`

`panel-form-ajax-error`

`panel-form-ajax-success`

`panel-multiple-added`

`panel-multiple-removed`

`panel-addable-exists-click`

Helpers.less
-----------
`.td-actions` - set row min width and remove text wrap

`.mb-5` - `.mb-25` - use to add margin-bottom
