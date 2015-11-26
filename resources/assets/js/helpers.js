$(document).ready(function () {

    $(document).on('click', '.js_panel_ajax-content', ajaxContent);
    $(document).on('submit', '.js_panel_form-ajax', submitFormAjax);
    $(document).on('click', '.js_panel_delete-table-row', deleteTableRow);
    $(document).on('change', '.js_panel_image-upload', uploadImage);
    $(document).on('click', '.js_panel_image-remove', removeImage);
    $(document).on('change', '.js_panel_ajax-row :input', changeAjaxRowInput);
    $(document).on('click', '.js_panel_multiple-add', clickMultipleAdd);
    $(document).on('click', '.js_panel_multiple-remove', clickMultipleRemove);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    function init() {

        $('.dd.js_panel_nestable-order').nestable({
            maxDepth: 1
        }).on('change', updateOrder);

        initPhoneMask();
        initMask();
        initChosen();
        initDatepicker();
        initTimepicker();

        bootbox.setDefaults({
            locale: "ru",
            size: 'small',
            backdrop: true
        });
    }

    function initPhoneMask() {
        $('.js_panel-input-phone').inputmask('+375 (99) 999-99-99');
    }

    function initMask() {
        $('.js_panel-input-mask').each(function() {
           $(this).inputmask($(this).data('mask'));
        });
    }


    init();

    function refresh() {
        initPhoneMask();
        initMask();
        initChosen();
        initDatepicker();
        initTimepicker();
    }

    $(document).ajaxComplete(function () {
        refresh();
    });

    function initDatepicker() {
        $('.js_panel-input-date').datepicker({
            format: 'dd.mm.yyyy',
            todayHighlight: true
        });
    }

    function initTimepicker() {
        $('.js_panel-input-time').timepicker({
            minuteStep: 1,
            showSeconds: false,
            showMeridian: false,
            defaultTime: false
        });
    }

    function initChosen() {
        $(".js_panel-input-chosen").chosen({
            no_results_text: "Ничего не найдено по запросу",
            placeholder_text_multiple: "Выберите из вариантов",
            search_contains: true
        });
    }

    function showNotification(text, title, type) {
        if (typeof title === 'undefined') {
            title = '';
        }
        if (typeof type === 'undefined') {
            type = 'primary';
        }
        $.gritter.add({
            position: 'top-right',
            title: title,
            text: text,
            class_name: 'gritter-' + type
        });
    }

    function ajaxContent(e) {
        e.preventDefault();
        var $link = $(this);
        var url = $link.attr('href');
        var wrapper = $link.data('wrapper');
        var $wrapper = $(wrapper);

        $.ajax({
            url: url,
            type: "GET",
            dataType: 'JSON',
            success: function (data) {
                if (data.result == 'success') {
                    $wrapper.html(data.view);
                    $.scrollTo($wrapper, 250, {
                        offset: {
                            top: -80
                        }
                    });
                    refresh();
                }
            }
        });
    }

    function submitFormAjax(e) {
        e.preventDefault(); // prevent native submit
        var $form = $(this);
        $form.append('<div class="loader"></div>');
        $form.find('.form-group').removeClass('has-error');
        $form.find('.error-block').html('');
        $form.ajaxSubmit({
            success: function (data) {
                $form.find('.loader').remove();
                if (data.result == 'success') {
                    if ($form.hasClass('js_form-ajax-redirect')) {
                        setTimeout(function () {
                            window.location.href = data.link;
                        }, 2000);
                    }
                    showNotification('Данные успешно сохранены', '', 'success');
                } else {
                    $.each(data.errors, function (name, errors) {
                        var $input = $(':input[name="' + name + '"]');
                        var $wrapper = $input.closest('.form-group');
                        var $error_block = $wrapper.find('.error-block');
                        var text = '';
                        $.each(errors, function (i, error) {
                            text += error + "<br>";
                        });
                        $wrapper.addClass('has-error');
                        var $help_block = '<span class="help-block">' + text + '</span>';
                        $error_block.append($help_block);
                    });
                    showNotification('Ошибка сохранения данных', '', 'danger');
                }
            }
        });
        return false;
    }

    function deleteTableRow(e) {
        e.preventDefault();
        var $link = $(this);
        var url = $link.attr('href');
        bootbox.confirm({
            message: "Вы действительно хотите удалить?",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: url,
                        type: "GET",
                        dataType: 'JSON',
                        success: function (data) {
                            if (data.result == 'success') {
                                var $tr = $link.closest('tr');
                                $tr.remove();
                                showNotification('Удаление прошло успешно', '', 'success');
                            }
                        }
                    });
                }
            }
        });
        return false;
    }

    function uploadImage() {
        var $wrapper = $(this).closest('.js_panel-image-upload-wrapper');
        var data_class = $wrapper.data('class');
        var data_params = $wrapper.data('params');
        var data_multiple = $wrapper.data('multiple');

        var uploaded = uploadImages($(this), data_class, data_params);

        var $row = $wrapper.find('.js_panel_image-row');
        if (uploaded.type == 'success') {
            $.each(uploaded.files, function (i, file) {
                if (!data_multiple) {
                    $row.find('.js_panel_image-col').not('.js_panel_image-col-clone').remove();
                }
                var $col_clone = $row.find('.js_panel_image-col-clone');
                var $col = $col_clone.clone();
                var $image = $col.find('.js_panel_image-img');
                var $input = $col.find('.js_panel_image-path');
                var $main = $col.find('.js_panel_image-main :input');
                $image.attr('src', file.path);
                $input.val(file.filename).prop('disabled', false);
                $main.prop('disabled', false);
                $col.removeClass('js_image-col-clone');
                $row.append($col);
            });
            resetMainImage($wrapper);
        }
    }

    function removeImage(e) {
        e.preventDefault();
        var $col = $(this).closest('.js_panel_image-col');
        var $wrapper = $col.closest('.js_panel-image-upload-wrapper');
        $col.remove();
        resetMainImage($wrapper);
    }

    function resetMainImage($wrapper) {
        var data_multiple = $wrapper.data('multiple');
        if (!data_multiple || (data_multiple && !$wrapper.find('.js_panel_image-main input:radio:enabled:checked').length)) {
            $wrapper.find('.js_panel_image-main input:radio:enabled:first').prop('checked', true);
        }
        var $cols = $wrapper.find('.js_panel_image-col').not('.js_panel_image-col-clone');
        $cols.each(function (i) {
            var $col = $(this);
            var $main = $col.find('.js_panel_image-main :input');
            $main.attr('value', i);
        });
    }

    function changeAjaxRowInput() {
        var $row = $(this).closest('tr');
        var link = $row.data('link');
        var dataObject = {};
        $row.find(':input').each(function () {
            var name = $(this).attr('name');
            var value = $(this).val();
            if ($(this).is(':checkbox')) {
                if ($(this).is(':checked')) {
                    value = 1;
                } else {
                    value = 0;
                }
            }
            dataObject[name] = value;
        });

        $.ajax({
            url: link,
            type: "POST",
            dataType: 'JSON',
            data: dataObject,
            success: function (data) {
                if (data.result == 'success') {
                    showNotification('Данные успешно сохранены', '', 'success');
                }
            }
        });
    }

    function updateOrder(e) {
        var $list = $(this);

        $list.append('<div class="loader"></div>');

        var link = $list.data('link');

        $list.find('.dd-item').each(function () {
            var $li = $(this);
            var order = $li.index();
            $li.attr('data-order', order);
        });

        var tree = window.JSON.stringify($list.nestable('serialize'));

        $.ajax({
            url: link,
            type: "POST",
            dataType: 'JSON',
            data: {
                tree: tree
            },
            success: function (data) {
                if (data.result == 'success') {
                    $list.find('.loader').remove();
                    showNotification('Обновление прошло успешно', '', 'success');
                }
            }
        });
    }

    function clickMultipleAdd(e) {
        e.preventDefault();
        var name = $(this).data('name');
        var $clone = $('.js_panel_multiple-row-clone[data-name="'+name+'"]');
        var $row = $clone.clone();
        $row.find(':input').prop('disabled', false);
        $row.insertBefore($clone);
        $row.removeClass('js_multiple-row-clone');
        return false;
    }

    function clickMultipleRemove(e) {
        e.preventDefault();
        var name = $(this).data('name');
        var $row = $(this).closest('.js_panel_multiple-row[data-name="'+name+'"]');
        $row.remove();
        return false;
    }
});