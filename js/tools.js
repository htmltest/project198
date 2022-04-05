$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $.validator.addMethod('inputDate',
        function(curDate, element) {
            if (this.optional(element) && curDate == '') {
                return true;
            } else {
                if (curDate.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                    return true;
                } else {
                    $.validator.messages['inputDate'] = 'Дата введена некорректно';
                    return false;
                }
            }
        },
        ''
    );

    $('body').on('input', '.form-input textarea', function() {
        this.style.height = (this.scrollHeight) + 'px';
    });

    $('body').on('click', '.form-files-list-item-remove', function(e) {
        var curLink = $(this);
        $.ajax({
            type: 'GET',
            url: curLink.attr('href'),
            dataType: 'json',
            cache: false
        }).done(function(data) {
            curLink.parent().remove();
        });
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.main-filter-menu a').click(function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            $('.main-filter-menu li.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.main-filter-menu li').index(curItem);
            $('.main-filter-content.active').removeClass('active');
            $('.main-filter-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.main-filter-detail-link a').click(function(e) {
        $(this).parents().filter('.main-filter-content').toggleClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.text-with-hint-link', function(e) {
        var curBlock = $(this).parent();
        if (curBlock.hasClass('open')) {
            curBlock.removeClass('open');
        } else {
            $('.text-with-hint.open').removeClass('open');
            curBlock.removeClass('to-right');
            curBlock.addClass('open');
            var curPopup = curBlock.find('.text-with-hint-popup');
            if (curPopup.offset().left + curPopup.outerWidth() > $(window).width()) {
                curBlock.addClass('to-right');
            }
        }
        e.preventDefault();
    });

    $('body').on('click', '.text-with-hint-popup-close', function(e) {
        $('.text-with-hint.open').removeClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.text-with-hint').length == 0) {
            $('.text-with-hint.open').removeClass('open');
        }
    });

    $('.chart-bar').each(function() {
        var curBlock = $(this);
        var curData = eval(curBlock.attr('data-datavar'));
        createChartBar(curBlock, curData);
    });

    $('body').on('click', '[data-href]', function(e) {
        window.location = $(this).attr('data-href');
        e.preventDefault();
    });

    $('.faq-item-title').click(function(e) {
        $(this).parent().toggleClass('open');
        $(this).parent().find('.faq-item-content').slideToggle();
        e.preventDefault();
    });

    $('.photo-gallery').each(function() {
        var curGallery = $(this);
        if (curGallery.find('.photo-gallery-item').length > curGallery.find('.photo-gallery-item:visible').length) {
            curGallery.addClass('with-more');
        }
    });

    $('.photo-gallery-more a').click(function(e) {
        var curGallery = $(this).parents().filter('.photo-gallery');
        if (curGallery.hasClass('view-all')) {
            curGallery.removeClass('view-all');
            curGallery.find('.photo-gallery-item').removeClass('visible');
        } else {
            var curCount = curGallery.find('.photo-gallery-item:visible').length;
            curCount += 6;
            curGallery.find('.photo-gallery-item:lt(' + curCount + ')').addClass('visible');
            if (curGallery.find('.photo-gallery-item').length == curGallery.find('.photo-gallery-item:visible').length) {
                curGallery.addClass('view-all');
            }
        }
        e.preventDefault();
    });

    $('.catalogue-filter-link a').click(function(e) {
        $('.catalogue-filter').toggleClass('open');
        e.preventDefault();
    });

    $('.catalogue-filter-hide a').click(function(e) {
        $('.catalogue-filter').removeClass('open');
        e.preventDefault();
    });

    $('.catalogue-filter-menu a').click(function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            $('.catalogue-filter-menu li.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.catalogue-filter-menu li').index(curItem);
            $('.catalogue-filter-content.active').removeClass('active');
            $('.catalogue-filter-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.catalogue-filter-section-title').click(function(e) {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    $('.catalogue-filter').each(function() {
        recalcCatalogueFilter();
    });

    $('.catalogue-filter select, .catalogue-filter input').change(function() {
        recalcCatalogueFilter();
    });

    $('.catalogue-filter-bottom .btn-reset').click(function(e) {
        $('.catalogue-filter select').val(null).trigger('change');
        $('.catalogue-filter input[type="checkbox"]').prop('checked', false).trigger('change');
        $('.catalogue-filter input[type="radio"]').prop('checked', false).trigger('change');
        $('.catalogue-filter input[type="radio"].catalogue-filter-radio-default').prop('checked', true).trigger('change');
        e.preventDefault();
    });

    $('.tabs-menu a').click(function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            var curTabs = curItem.parents().filter('.tabs');
            curTabs.find('.tabs-menu li.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = curTabs.find('.tabs-menu li').index(curItem);
            curTabs.find('.tabs-content.active').removeClass('active');
            curTabs.find('.tabs-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
    });

    curForm.find('.form-input-date input').mask('00.00.0000');
    curForm.find('.form-input-date input').attr('autocomplete', 'off');
    curForm.find('.form-input-date input').addClass('inputDate');

    curForm.find('.form-input-date input').on('keyup', function() {
        var curValue = $(this).val();
        if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
            var isCorrectDate = true;
            var userDate = new Date(curValue.substr(6, 4), Number(curValue.substr(3, 2)) - 1, Number(curValue.substr(0, 2)));
            if ($(this).attr('min')) {
                var minDateStr = $(this).attr('min');
                var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                if (userDate < minDate) {
                    isCorrectDate = false;
                }
            }
            if ($(this).attr('max')) {
                var maxDateStr = $(this).attr('max');
                var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                if (userDate > maxDate) {
                    isCorrectDate = false;
                }
            }
            if (isCorrectDate) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                    myDatepicker.show();
                    $(this).focus();
                }
            } else {
                $(this).addClass('error');
                return false;
            }
        }
    });

    curForm.find('.form-input-date input').each(function() {
        var minDateText = $(this).attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(Number(minDateArray[2]), Number(minDateArray[1]) - 1, Number(minDateArray[0]));
        }
        var maxDateText = $(this).attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(Number(maxDateArray[2]), Number(maxDateArray[1]) - 1, Number(maxDateArray[0]));
        }
        if ($(this).hasClass('maxDate1Year')) {
            var curDate = new Date();
            curDate.setFullYear(curDate.getFullYear() + 1);
            curDate.setDate(curDate.getDate() - 1);
            maxDate = curDate;
            var maxDay = curDate.getDate();
            if (maxDay < 10) {
                maxDay = '0' + maxDay
            }
            var maxMonth = curDate.getMonth() + 1;
            if (maxMonth < 10) {
                maxMonth = '0' + maxMonth
            }
            $(this).attr('max', maxDay + '.' + maxMonth + '.' + curDate.getFullYear());
        }
        var startDate = new Date();
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
            }
        }
        $(this).datepicker({
            language: 'ru',
            prevHtml: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59L11.1249 12L15.7049 7.41Z" /></svg>',
            nextHtml: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z" /></svg>',
            minDate: minDate,
            maxDate: maxDate,
            startDate: startDate,
            toggleSelected: false
        });
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                $(this).data('datepicker').selectDate(startDate);
            }
        }
    });

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 20
        }

        if ($(window).width() > 1119) {
            options['dropdownAutoWidth'] = true;
        }

        if (curSelect.parents().filter('.window').length == 1) {
            options['dropdownParent'] = $('.window-content');
        }

        if (curForm.parents().filter('.catalogue-filter').length == 1) {
            options['allowClear'] = true;
        }

        curSelect.select2(options);
    });

    curForm.find('.form-files').each(function() {
        var curFiles = $(this);
        var curInput = curFiles.find('.form-files-input input');

        var uploadURL = curInput.attr('data-uploadurl');
        var uploadFiles = curInput.attr('data-uploadfiles');
        var removeURL = curInput.attr('data-removeurl');
        curInput.fileupload({
            url: uploadURL,
            dataType: 'json',
            add: function(e, data) {
                curFiles.find('.form-files-list').append('<div class="form-files-list-item-progress"><span class="form-files-list-item-cancel"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></span></div>');
                data.submit();
            },
            done: function (e, data) {
                curFiles.find('.form-files-list-item-progress').eq(0).remove();
                curFiles.find('.form-files-list').append('<div class="form-files-list-item"><div class="form-files-list-item-icon"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-icon-2"></use></svg><span>' + data.result.ext + '</span></div><div class="form-files-list-item-name">' + data.result.path + '</div><div class="form-files-list-item-size">' + Number(data.result.size).toFixed(2) + ' Мб</div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></div>');
            }
        });
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (curForm.hasClass('ajax-form')) {
                if (curForm.hasClass('recaptcha-form')) {
                    grecaptcha.ready(function() {
                        grecaptcha.execute('6LdHSvgcAAAAAHfkqTliNRLNbN8n4oSa0UJfMCU3', {action: 'submit'}).then(function(token) {
                            $.ajax({
                                type: 'POST',
                                url: curForm.attr('data-captchaurl'),
                                dataType: 'json',
                                data: 'recaptcha_response=' + token,
                                cache: false
                            }).fail(function(jqXHR, textStatus, errorThrown) {
                                alert('Сервис временно недоступен, попробуйте позже.' + textStatus);
                                curForm.removeClass('loading');
                            }).done(function(data) {
                                if (data.status) {
                                    curForm.addClass('loading');
                                    var formData = new FormData(form);

                                    if (curForm.find('[type=file]').length != 0) {
                                        var file = curForm.find('[type=file]')[0].files[0];
                                        formData.append('file', file);
                                    }

                                    $.ajax({
                                        type: 'POST',
                                        url: curForm.attr('action'),
                                        processData: false,
                                        contentType: false,
                                        dataType: 'json',
                                        data: formData,
                                        cache: false
                                    }).done(function(data) {
                                        if (data.status) {
                                            curForm.find('.form-input input, .form-input textarea').each(function() {
                                                $(this).val('').trigger('change blur').removeClass('error valid');
                                                $(this).parent().removeClass('focus full');
                                            });
                                            curForm.find('.support-products .main-feedback-row:gt(0)').remove();
                                            curForm.find('.support-produce-select-series').html('<option value=""></option>');
                                            curForm.find('.support-produce-select-series').trigger('change');
                                            curForm.find('.support-produce-select-category option:selected').prop('selected', false);
                                            curForm.find('.support-produce-select-category').trigger('change');
                                            curForm.prepend('<div class="message message-success">' + data.message + '</div>')
                                        } else {
                                            curForm.prepend('<div class="message message-error">' + data.message + '</div>')
                                        }
                                        curForm.removeClass('loading');
                                    });
                                } else {
                                    alert('Не пройдена проверка Google reCAPTCHA v3.');
                                    curForm.removeClass('loading');
                                }
                            });
                        });
                    });
                } else {
                    curForm.addClass('loading');
                    var formData = new FormData(form);

                    $.ajax({
                        type: 'POST',
                        url: curForm.attr('action'),
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        data: formData,
                        cache: false
                    }).done(function(data) {
                        curForm.find('.message').remove();
                        if (data.status) {
                            curForm.find('.form-input input, .form-input textarea').each(function() {
                                $(this).val('').trigger('change blur').removeClass('error valid');
                                $(this).parent().removeClass('focus full');
                            });
                            curForm.find('.support-products .main-feedback-row:gt(0)').remove();
                            curForm.find('.support-produce-select-series').html('<option value=""></option>');
                            curForm.find('.support-produce-select-series').trigger('change');
                            curForm.find('.support-produce-select-category option:selected').prop('selected', false);
                            curForm.find('.support-produce-select-category').trigger('change');
                            curForm.prepend('<div class="message message-success">' + data.message + '</div>')
                        } else {
                            curForm.prepend('<div class="message message-error">' + data.message + '</div>')
                        }
                        if ($(window).width() < 1200) {
                            $('html, body').animate({'scrollTop': $('#feedback').offset().top - $('header').height()});
                        }
                        curForm.removeClass('loading');
                    });
                }
            } else if (curForm.hasClass('window-form')) {
                if (curForm.hasClass('recaptcha-form')) {
                    grecaptcha.ready(function() {
                        grecaptcha.execute('6LdHSvgcAAAAAHfkqTliNRLNbN8n4oSa0UJfMCU3', {action: 'submit'}).then(function(token) {
                            $.ajax({
                                type: 'POST',
                                url: curForm.attr('data-captchaurl'),
                                dataType: 'json',
                                data: 'recaptcha_response=' + token,
                                cache: false
                            }).fail(function(jqXHR, textStatus, errorThrown) {
                                alert('Сервис временно недоступен, попробуйте позже.' + textStatus);
                                curForm.removeClass('loading');
                            }).done(function(data) {
                                if (data.status) {
                                    curForm.addClass('loading');
                                    var formData = new FormData(form);

                                    if (curForm.find('[type=file]').length != 0) {
                                        var file = curForm.find('[type=file]')[0].files[0];
                                        formData.append('file', file);
                                    }

                                    $.ajax({
                                        type: 'POST',
                                        url: curForm.attr('action'),
                                        processData: false,
                                        contentType: false,
                                        dataType: 'json',
                                        data: formData,
                                        cache: false
                                    }).done(function(data) {
                                        if (data.status) {
                                            curForm.find('.form-input input, .form-input textarea').each(function() {
                                                $(this).val('').trigger('change blur').removeClass('error valid');
                                                $(this).parent().removeClass('focus full');
                                            });
                                            curForm.find('.support-products .main-feedback-row:gt(0)').remove();
                                            curForm.find('.support-produce-select-series').html('<option value=""></option>');
                                            curForm.find('.support-produce-select-series').trigger('change');
                                            curForm.find('.support-produce-select-category option:selected').prop('selected', false);
                                            curForm.find('.support-produce-select-category').trigger('change');
                                            curForm.prepend('<div class="message message-success">' + data.message + '</div>')
                                        } else {
                                            curForm.prepend('<div class="message message-error">' + data.message + '</div>')
                                        }
                                    });
                                    curForm.removeClass('loading');
                                } else {
                                    alert('Не пройдена проверка Google reCAPTCHA v3.');
                                    curForm.removeClass('loading');
                                }
                            });
                        });
                    });
                } else {
                    var formData = new FormData(form);

                    windowOpen(curForm.attr('action'), formData);
                }
            } else if (curForm.hasClass('recaptcha-form')) {
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LdHSvgcAAAAAHfkqTliNRLNbN8n4oSa0UJfMCU3', {action: 'submit'}).then(function(token) {
                        $.ajax({
                            type: 'POST',
                            url: curForm.attr('data-captchaurl'),
                            dataType: 'json',
                            data: 'recaptcha_response=' + token,
                            cache: false
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                            alert('Сервис временно недоступен, попробуйте позже.' + textStatus);
                        }).done(function(data) {
                            if (data.status) {
                                form.submit();
                            } else {
                                alert('Не пройдена проверка Google reCAPTCHA v3.');
                            }
                        });
                    });
                });
            } else {
                form.submit();
            }
        }
    });
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curWidth = $(window).width();
        if (curWidth < 480) {
            curWidth = 480;
        }
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window form').each(function() {
            initForm($(this));
        });

        $(window).trigger('resize');

    });
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }
}

function createChartBar(curBlock, curData) {
    var newHTML = '<div class="chart-bar">';

    if (curData !== null) {
        var curMax = 0;
        for (var i = 0; i < curData.length; i++) {
            curValue = curData[i].value;
            if (curMax < curValue) {
                curMax = curValue;
            }
        }

        var stepMax = Math.ceil(curMax + curMax / 6);

        var stepSize = stepMax / 6;
        var steps = [];
        for (var i = 0; i < 7; i++) {
            steps.push(Math.ceil(i * stepSize));
        }

        for (var i = 0; i < curData.length; i++) {
            var classMain = '';
            if (typeof(curData[i].main) != 'undefined' && curData[i].main == true) {
                classMain = 'chart-bar-row-main'
            }
            newHTML +=  '<div class="chart-bar-row ' + classMain + '">' +
                            '<div class="chart-bar-row-title">' + curData[i].title + '</div>' +
                            '<div class="chart-bar-row-value">' +
                                '<div class="chart-bar-row-back">';
            for (var j = 0; j < steps.length; j++) {
                newHTML +=          '<div class="chart-bar-row-back-item" style="left:' + (steps[j] / stepMax * 100) + '%"></div>';
            }
            newHTML +=          '</div>' +
                                '<div class="chart-bar-row-line" style="width:' + (curData[i].value / stepMax * 100) + '%"></div>';
            newHTML +=          '<div class="chart-bar-row-value-text">' + curData[i].value + '</div>';

            newHTML +=      '</div>' +
                        '</div>';
        }
    }

    newHTML +=  '</div>';

    curBlock.html(newHTML);
}

$(window).on('load resize', function() {

    $('.catalogue').each(function() {
        var curList = $(this);

        curList.find('.catalogue-item a').css({'min-height': '0px'});

        curList.find('.catalogue-item a').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.catalogue-item').offset().top;

            curList.find('.catalogue-item a').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.catalogue-item').offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });

});

function recalcCatalogueFilter() {
    var countOptions = 0;

    $('.catalogue-filter-section').each(function() {
        var curSection = $(this);

        var curOpions = 0;

        curSection.find('select').each(function() {
            if ($(this).val() != '') {
                curOpions++;
            }
        });

        curOpions += curSection.find('input[type="checkbox"]:checked').length;

        curOpions += curSection.find('input[type="radio"]:not(.catalogue-filter-radio-default):checked').length;

        countOptions += curOpions;

        if (curOpions > 0) {
            curSection.find('.catalogue-filter-section-title span').html(curOpions);
            curSection.find('.catalogue-filter-section-title span').addClass('visible');
        } else {
            curSection.find('.catalogue-filter-section-title span').removeClass('visible');
        }
    });

    if (countOptions > 0) {
        $('.catalogue-filter-link a strong').html(countOptions);
        $('.catalogue-filter-link a strong').addClass('visible');
        $('.catalogue-filter').addClass('selected');
    } else {
        $('.catalogue-filter-link a strong').removeClass('visible');
        $('.catalogue-filter').removeClass('selected');
    }
}