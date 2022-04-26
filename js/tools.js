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

    $('.main-filter-detail-link a').click(function(e) {
        $(this).parents().filter('.main-filter-container').toggleClass('open');
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

    var morePhotos;
    $('.photo-gallery-list').each(function() {
        var curBlock = $(this).parent();
        var curSize = 16;
        if (curBlock.find('.photo-gallery-item').length > curSize) {
            curBlock.addClass('with-more');
            morePhotos = $('<div>' + curBlock.find('.photo-gallery-list').html() + '</div>');
            curBlock.find('.photo-gallery-item:gt(' + (curSize - 1) + ')').remove();
        }
    });

    var $grid = $('.photo-gallery-list').masonry({
        itemSelector: '.photo-gallery-item'
    });

    $('.photo-gallery-list img').one('load', function() {
         $grid.masonry('layout');
    });

    $('.photo-gallery-more a').click(function(e) {
        var curBlock = $(this).parents().filter('.photo-gallery');
        var countItems = morePhotos.find('.photo-gallery-item').length;
        var countVisible = curBlock.find('.photo-gallery-item').length;
        var curSize = 16;
        if (countVisible + curSize >= countItems) {
            curBlock.removeClass('with-more');
        }

        var curIndex = -1;
        $('<div>' + morePhotos.html() + '</div>').find('.photo-gallery-item').each(function() {
            var elem = $(this);
            curIndex++;
            if (curIndex > countVisible - 1 && curIndex < countVisible + curSize) {
                $grid.masonry().append(elem).masonry('appended', elem).masonry();
                curBlock.find('.photo-gallery-list img').one('load', function() {
                     $grid.masonry('layout');
                });
            }
        });

        e.preventDefault();
    });

    $('body').on('click', '.tabs-menu a', function(e) {
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

    $('.ckp-detail-reviews-list').each(function() {
        if ($('.ckp-detail-reviews-item').length > 2) {
            $('.ckp-detail-reviews-more').addClass('visible');
        }
    });

    $('.ckp-detail-reviews-more').click(function(e) {
        var curBlock = $('.ckp-detail-reviews-list');
        if ($('.ckp-detail-reviews-more').hasClass('view-all')) {
            count = 2;
            curBlock.find('.ckp-detail-reviews-item.visible').removeClass('visible');
            $('.ckp-detail-reviews-more').removeClass('view-all');
        } else {
            var count = curBlock.find('.ckp-detail-reviews-item:visible').length;
            count += 2;
            curBlock.find('.ckp-detail-reviews-item:lt(' + count + ')').addClass('visible');
            if (count >= curBlock.find('.ckp-detail-reviews-item').length) {
                $('.ckp-detail-reviews-more').addClass('view-all');
            }
        }
        e.preventDefault();
    });

    $('.ckp-detail-questions-list').each(function() {
        if ($('.ckp-detail-questions-item').length > 2) {
            $('.ckp-detail-questions-more').addClass('visible');
        }
    });

    $('.ckp-detail-questions-more').click(function(e) {
        var curBlock = $('.ckp-detail-questions-list');
        if ($('.ckp-detail-questions-more').hasClass('view-all')) {
            count = 2;
            curBlock.find('.ckp-detail-questions-item.visible').removeClass('visible');
            $('.ckp-detail-questions-more').removeClass('view-all');
        } else {
            var count = curBlock.find('.ckp-detail-questions-item:visible').length;
            count += 2;
            curBlock.find('.ckp-detail-questions-item:lt(' + count + ')').addClass('visible');
            if (count >= curBlock.find('.ckp-detail-questions-item').length) {
                $('.ckp-detail-questions-more').addClass('view-all');
            }
        }
        e.preventDefault();
    });

    $('.news-search-select-current').click(function() {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.news-search-select').length == 0) {
            $('.news-search-select').removeClass('open');
        }
    });

    $('.news-search-select-item label input').change(function() {
        var curSelect = $(this).parents().filter('.news-search-select');
        var curText = '';
        curSelect.find('.news-search-select-item label input:checked').each(function() {
            if (curText != '') {
                curText += ', ';
            }
            curText += $(this).parent().find('span').html();
        });
        if (curText != '') {
            curSelect.find('.news-search-select-current span').html(curText);
            curSelect.find('.news-search-select-current').removeClass('default');
        } else {
            curSelect.find('.news-search-select-current span').html(curSelect.find('.news-search-select-current').attr('data-default'));
            curSelect.find('.news-search-select-current').addClass('default');
        }
    });

    function popupCenter(url, title) {
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        var left = ((width / 2) - (480 / 2)) + dualScreenLeft;
        var top = ((height / 3) - (360 / 3)) + dualScreenTop;
        var newWindow = window.open(url, title, 'scrollbars=yes, width=' + 480 + ', height=' + 360 + ', top=' + top + ', left=' + left);
        if (window.focus) {
            newWindow.focus();
        }
    }

    $('body').on('click', '.news-detail-social-vk', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://vk.com/share.php?url=' + curUrl + '&description=' + curTitle, curTitle);

        e.preventDefault();
    });

    $('.ntr-map').each(function() {
        var newHTML = '';

        newHTML +=  '<div class="ntr-map-img"><svg viewBox="0 0 1107.77 630.12" fill="none" xmlns="http://www.w3.org/2000/svg"></svg></div>';

        var curData = ntrData;

        $('.ntr-map').html(newHTML);

        if (curData !== null) {
            var newMap = '';

            for (var j = 0; j < russiaRegions.length; j++) {
                var curRegion = russiaRegions[j];
                for (var i = 0; i < curData.length; i++) {
                    if (curRegion.id == curData[i][0]) {
                        newMap += '<g data-title="' + curRegion.title + '">' + curRegion.svg + '</g>';
                    }
                }
            }
            $('.ntr-map-img svg').html(newMap);
        }
    });

    $('body').on('click', '.ntr-map-zoom-inc', function(e) {
        $('.ntr-map-img').css({'transform': 'translate(-1108px, -631px)', 'width': 2216, 'height': 1262, 'left': '50%', 'top': '50%'});
        $('.ntr-map-img').data('curLeft', -1108);
        $('.ntr-map-img').data('curTop', -631);
        e.preventDefault();
    });

    $('body').on('click', '.ntr-map-zoom-dec', function(e) {
        $('.ntr-map-img').css({'transform': 'none', 'width': '100%', 'height': 'auto', 'left': 'auto', 'top': 'auto'});
        e.preventDefault();
    });

    var mapDrag = false;
    var mapMove = false;
    var mapMoveTimer = null;
    var mapStartX = 0;
    var mapStartY = 0;

    var isTouchCapable = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;

    if (!isTouchCapable) {
        $('.ntr-map-img').on('mousedown', function(e) {
            mapDrag = true;
            mapStartX = e.pageX;
            mapStartY = e.pageY;
        });

        $('.ntr-map-img').on('mousemove', function(e) {
            if (mapDrag) {
                mapMove = true;
                var curLeft = Number($('.ntr-map-img').data('curLeft'));
                var curTop = Number($('.ntr-map-img').data('curTop'));
                var curDiffX = e.pageX;
                var curDiffY = e.pageY;
                curDiffX = curDiffX - mapStartX;
                curDiffY = curDiffY - mapStartY;
                curLeft += curDiffX;
                curTop += curDiffY;
                mapStartX = e.pageX;
                mapStartY = e.pageY;
                $('.ntr-map-img').css({'transform': 'translate(' + curLeft + 'px, ' + curTop + 'px)'});
                $('.ntr-map-img').data('curLeft', curLeft);
                $('.ntr-map-img').data('curTop', curTop);
            }
        });

        $(document).on('mouseup', function(e) {
            mapDrag = false;
            if (mapMove) {
                window.clearTimeout(mapMoveTimer);
                mapMoveTimer = null;
                mapMoveTimer = window.setTimeout(function() {
                    mapMove = false;
                }, 100);
            }
        });
    } else {
        $('.ntr-map-img').on('touchstart', function(e) {
            mapDrag = true;
            mapStartX = e.originalEvent.touches[0].pageX;
            mapStartY = e.originalEvent.touches[0].pageY;
        });

        $('.ntr-map-img').on('touchmove', function(e) {
            if (mapDrag) {
                var curLeft = Number($('.ntr-map-img').data('curLeft'));
                var curTop = Number($('.ntr-map-img').data('curTop'));
                var curDiffX = e.originalEvent.touches[0].pageX;
                var curDiffY = e.originalEvent.touches[0].pageY;
                curDiffX = curDiffX - mapStartX;
                curDiffY = curDiffY - mapStartY;
                curLeft += curDiffX;
                curTop += curDiffY;
                mapStartX = e.originalEvent.touches[0].pageX;
                mapStartY = e.originalEvent.touches[0].pageY;
                $('.ntr-map-img').css({'transform': 'translate(' + curLeft + 'px, ' + curTop + 'px)'});
                $('.ntr-map-img').data('curLeft', curLeft);
                $('.ntr-map-img').data('curTop', curTop);
            }
            e.preventDefault();
        });

        $(document).on('touchend', function(e) {
            mapDrag = false;
        });
    }

    $('.up-link').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

    $('.header-top-add').click(function(e) {
        $('html').toggleClass('menu-add-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-top-left').length == 0) {
            $('html').removeClass('menu-add-open');
        }
    });

    $('.catalogue-page-size-select-current').click(function() {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.catalogue-page-size-select').length == 0) {
            $('.catalogue-page-size-select').removeClass('open');
        }
    });

    $('.catalogue-page-size-select-item label input').change(function() {
        var curSelect = $(this).parents().filter('.catalogue-page-size');
        var curText = '';
        curSelect.find('.catalogue-page-size-select-item label input:checked').each(function() {
            curText = $(this).parent().find('span').html();
        });
        curSelect.find('.catalogue-page-size-select-current span').html(curText);
        $('.catalogue-page-size-select').removeClass('open');
    });

    $('.catalogue-filter-link a').click(function(e) {
        $('html').toggleClass('catalogue-filter-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.catalogue-filter-container').length == 0 && $(e.target).parents().filter('.catalogue-filter-link').length == 0 && !$(e.target).hasClass('catalogue-filter-link') && !$(e.target).hasClass('catalogue-filter-container')) {
            $('html').removeClass('catalogue-filter-open');
        }
    });

    $('.catalogue-filter-section-title').click(function(e) {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    $('.catalogue-filter').each(function() {
        var curID = 0;
        $('.catalogue-filter-container').find('.form-input input, select, .form-checkbox input').each(function() {
            $(this).attr('data-filterid', curID);
            curID++;
        });
        updateCatalogueFilterOptions();
    });

    $('.catalogue-filter-container').find('.form-input input, select, .form-checkbox input').change(function() {
        updateCatalogueFilterOptions();
    });

    $('.catalogue-filter-view a').click(function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            $('.catalogue-filter-view a.active').removeClass('active');
            curLink.addClass('active');
        }
        e.preventDefault();
    });

    $('.catalogue-filter-sort-item a').click(function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            $('.catalogue-filter-sort-item a.active').removeClass('active');
            curLink.addClass('active');
        }
        e.preventDefault();
    });

    $('body').on('click', '.catalogue-filter-option a', function(e) {
        var curOption = $(this).parent();
        var curId = $(this).attr('data-filterid');

        $('.catalogue-filter-container').find('.form-input input[data-filterid="' + curId + '"]').each(function() {
            $(this).val('');
            $(this).trigger('change')
        });

        $('.catalogue-filter-container').find('select[data-filterid="' + curId + '"]').each(function() {
            $(this).val(null).trigger('change');
        });

        $('.catalogue-filter-container').find('.form-checkbox input[data-filterid="' + curId + '"]').each(function() {
            $(this).prop('checked', false);
            $(this).trigger('change');
        });

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
            options['dropdownParent'] = $('.catalogue-filter-container');
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

        var $gridWindow = $('.window .photo-gallery-list').masonry({
            itemSelector: '.window .photo-gallery-item'
        });

        $('.window .photo-gallery-list img').one('load', function() {
             $gridWindow.masonry('layout');
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

    $('.main-who').each(function() {
        var curList = $(this);

        curList.find('.main-who-item-inner').css({'min-height': '0px'});

        curList.find('.main-who-item-inner').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.main-who-item').offset().top;

            curList.find('.main-who-item-inner').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.main-who-item').offset().top == curTop) {
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

    $('.main-about').each(function() {
        var curList = $(this);

        curList.find('.main-about-item-anonce').css({'min-height': '0px'});

        curList.find('.main-about-item-anonce').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.main-about-item').offset().top;

            curList.find('.main-about-item-anonce').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.main-about-item').offset().top == curTop) {
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

    $('.services').each(function() {
        var curList = $(this);

        curList.find('.services-item-title').css({'min-height': '115px'});

        curList.find('.services-item-title').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.services-item').offset().top;

            curList.find('.services-item-title').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.services-item').offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });

        curList.find('.services-item-bottom-inner').css({'height': 'auto'});

        curList.find('.services-item-bottom-inner').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.services-item').offset().top;

            curList.find('.services-item-bottom-inner').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.services-item').offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'height': curHeight + 'px'});
                    }
                }
            });
        });
    });

});

$(window).on('load resize scroll', function() {

    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if ($('.up-link').length == 1) {
        if (windowScroll > windowHeight) {
            $('.up-link').addClass('visible');
        } else {
            $('.up-link').removeClass('visible');
        }

        if (windowScroll + windowHeight > $('footer').offset().top) {
            $('.up-link').css({'margin-bottom': (windowScroll + windowHeight) - $('footer').offset().top});
        } else {
            $('.up-link').css({'margin-bottom': 0});
        }
    }

    if ($('.social-links').length == 1) {
        if (windowScroll > windowHeight) {
            $('.social-links').addClass('visible');
        } else {
            $('.social-links').removeClass('visible');
        }

        if (windowScroll + windowHeight > $('footer').offset().top) {
            $('.social-links').css({'margin-bottom': (windowScroll + windowHeight) - $('footer').offset().top});
        } else {
            $('.social-links').css({'margin-bottom': 0});
        }
    }

    if ($('header').length > 0 && windowScroll >= $('header').outerHeight()) {
        $('html').addClass('header-fixed');
    } else {
        $('html').removeClass('header-fixed');
    }

});

function updateCatalogueFilterOptions() {
    var newHTML = '';

    $('.catalogue-filter-container').find('.form-input input').each(function() {
        var curInput = $(this);
        var curValue = curInput.val();
        if (curValue != '') {
            var curLabel = curInput.parent().parent().find('.form-label').html();
            newHTML += '<div class="catalogue-filter-option">' + curLabel + ': <span>' + curValue + '</span><a href="#" data-filterid="' + curInput.attr('data-filterid') + '"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-filter-option-remove"></use></svg></a></div>';
        }
    });

    $('.catalogue-filter-container').find('select').each(function() {
        var curInput = $(this);
        var curValue = curInput.find('option:selected').html();
        if (curValue != '') {
            var curLabel = curInput.parent().parent().find('.form-label').html();
            newHTML += '<div class="catalogue-filter-option">' + curLabel + ': <span>' + curValue + '</span><a href="#" data-filterid="' + curInput.attr('data-filterid') + '"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-filter-option-remove"></use></svg></a></div>';
        }
    });

    $('.catalogue-filter-container').find('.form-checkbox input:checked').each(function() {
        var curInput = $(this);
        var curLabel = curInput.parents().filter('label').find('span').html();
        newHTML += '<div class="catalogue-filter-option"><span>' + curLabel + '</span><a href="#" data-filterid="' + curInput.attr('data-filterid') + '"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-filter-option-remove"></use></svg></a></div>';
    });

    $('.catalogue-filter-options').html(newHTML);
}