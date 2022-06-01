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

	$('body').on('blur', '.form-input input, .form-input textarea', function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

	$('body').on('keyup', '.form-input input, .form-input textarea', function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

	$('body').on('click', '.form-input-clear', function(e) {
        $(this).parent().find('input').val('').trigger('change').trigger('blur');
        e.preventDefault();
	});

    $('body').on('input', '.form-input textarea', function() {
        this.style.height = (this.scrollHeight) + 'px';
    });

    $('body').on('click', '.form-files-list-item-remove', function(e) {
        var curLink = $(this);
        var curFiles = curLink.parents().filter('.form-files');
        $.ajax({
            type: 'GET',
            url: curLink.attr('href'),
            dataType: 'json',
            cache: false
        }).done(function(data) {
            curLink.parent().remove();
            if (curFiles.find('.form-files-list-item-progress, .form-files-list-item').length == 0) {
                curFiles.removeClass('full');
            }
        });
        e.preventDefault();
    });

    $('body').on('click', '.form-files-list-item-cancel', function(e) {
        var curLink = $(this);
        var curFiles = curLink.parents().filter('.form-files');
        curLink.parent().remove();
        if (curFiles.find('.form-files-list-item-progress, .form-files-list-item').length == 0) {
            curFiles.removeClass('full');
        }
        e.preventDefault();
    });

    $(document).bind('drop dragover', function (e) {
        e.preventDefault();
    });

    $(document).bind('dragover', function (e) {
        var dropZones = $('.form-files-dropzone'),
            timeout = window.dropZoneTimeout;
        if (timeout) {
            clearTimeout(timeout);
        } else {
            dropZones.addClass('in');
        }
        var hoveredDropZone = $(e.target).closest(dropZones);
        dropZones.not(hoveredDropZone).removeClass('hover');
        hoveredDropZone.addClass('hover');
        window.dropZoneTimeout = setTimeout(function () {
            window.dropZoneTimeout = null;
            dropZones.removeClass('in hover');
        }, 100);
    });

    $('body').on('click', '.form-files-dropzone', function(e) {
        var curLink = $(this);
        var curFiles = $(this).parents().filter('.form-files');
        curFiles.find('.form-files-input input').click();
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        if (curLink.attr('href')) {
            windowOpen(curLink.attr('href'));
            e.preventDefault();
        } else if (curLink.attr('data-href')) {
            windowOpen(curLink.attr('data-href'));
            e.preventDefault();
        }
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
        if (!$(this).hasClass('window-link')) {
            window.location = $(this).attr('data-href');
            e.preventDefault();
        }
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

    $('.tabs').each(function() {
        var curTabs = $(this);
        var newHTML = '<ul>';
        curTabs.find('.tabs-content').each(function() {
            newHTML += '<li><a href="#">' + $(this).attr('data-title') + '</a></li>';
        });
        newHTML += '</ul>';
        curTabs.find('.tabs-menu').html(newHTML);
        curTabs.find('.tabs-menu li').eq(0).addClass('active');
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

    $('body').on('click', '.registration .tabs-menu a', function(e) {
        var curItem = $(this).parent();
        var curTabs = curItem.parents().filter('.tabs');
        var curIndex = curTabs.find('.tabs-menu li').index(curItem);
        $('html').addClass('registration-tab-open');
        curTabs.find('.tabs-content').eq(curIndex).addClass('registration-active');
        if ($(window).width() < 1206) {
            $('html, body').animate({'scrollTop': 0});
        }
        e.preventDefault();
    });

    $('.registration-mobile-back .back-link a').click(function(e) {
        $('html').removeClass('registration-tab-open');
        $('.tabs-content').removeClass('registration-active');
        if ($(window).width() < 1206) {
            $('html, body').animate({'scrollTop': 0});
        }
        e.preventDefault();
    });

    $('.ckp-detail-services').each(function() {
        var curBlock = $(this);
        if (curBlock.find('.ckp-detail-services-item').length > 4) {
            curBlock.addClass('visible-more');
        }
    });

    $('.ckp-detail-services-more').click(function(e) {
        var curBlock = $(this).parent().find('.ckp-detail-services');
        if (curBlock.hasClass('view-all')) {
            count = 4;
            curBlock.find('.ckp-detail-services-item.visible').removeClass('visible');
            curBlock.removeClass('view-all');
        } else {
            var count = curBlock.find('.ckp-detail-services-item:visible').length;
            count += 4;
            curBlock.find('.ckp-detail-services-item:lt(' + count + ')').addClass('visible');
            if (count >= curBlock.find('.ckp-detail-services-item').length) {
                curBlock.addClass('view-all');
            }
        }
        e.preventDefault();
    });

    $('.ckp-detail-equipments').each(function() {
        var curBlock = $(this);
        if (curBlock.find('.ckp-detail-equipments-item').length > 4) {
            curBlock.addClass('visible-more');
        }
    });

    $('.ckp-detail-equipments-more').click(function(e) {
        var curBlock = $(this).parent().find('.ckp-detail-equipments');
        if (curBlock.hasClass('view-all')) {
            count = 4;
            curBlock.find('.ckp-detail-equipments-item.visible').removeClass('visible');
            curBlock.removeClass('view-all');
        } else {
            var count = curBlock.find('.ckp-detail-equipments-item:visible').length;
            count += 4;
            curBlock.find('.ckp-detail-equipments-item:lt(' + count + ')').addClass('visible');
            if (count >= curBlock.find('.ckp-detail-equipments-item').length) {
                curBlock.addClass('view-all');
            }
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

    $('body').on('click', '.news-detail-social-telegram', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://telegram.me/share/url?url=' + curUrl + '&text=' + curTitle, curTitle);

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
        updateCatalogue();
    });

    $('body').on('click', '.catalogue-paging .pager a', function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            $('.catalogue-paging .pager a.active').removeClass('active');
            curLink.addClass('active');
            updateCatalogue();
        }
        e.preventDefault();
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
        $('.catalogue-filter-container form').each(function() {
            var curForm = $(this);
            var validator = curForm.validate();
            if (validator) {
                validator.destroy();
            }
            curForm.validate({
                ignore: '',
                submitHandler: function(form) {
                    updateCatalogue();
                }
            });
        });
    });

    $('.catalogue-filter-container').find('.form-input input, select, .form-checkbox input').change(function() {
        updateCatalogueFilterOptions();
        updateCatalogue();
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
            updateCatalogue();
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

    $('body').on('click', '.window-photo-social-item-tg', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://telegram.me/share/url?url=' + curUrl + '&text=' + curTitle, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-social-item-vk', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://vk.com/share.php?url=' + curUrl + '&description=' + curTitle, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-social-item-link', function(e) {
        e.preventDefault();
    });

    var clipboardPhoto = new ClipboardJS('.window-photo-social-item-link')
    clipboardPhoto.on('success', function(e) {
        alert('OK');
    });

    $('body').on('click', '.photo-gallery-item a', function(e) {
        var curLink = $(this);
        var curItem = curLink.parent();
        var curGallery = curItem.parents().filter('.photo-gallery-list');
        var curIndex = curGallery.find('.photo-gallery-item').index(curItem);

        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-photo-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        var windowHTML =    '<div class="window-photo">';

        windowHTML +=           '<div class="window-photo-preview">' +
                                    '<div class="window-photo-preview-inner">' +
                                        '<div class="window-photo-preview-list">';

        var galleryLength = curGallery.find('.photo-gallery-item').length;
        for (var i = 0; i < galleryLength; i++) {
            var curTitle = '';
            var curGalleryItem = curGallery.find('.photo-gallery-item').eq(i);
            windowHTML +=                   '<div class="window-photo-preview-list-item"><a href="#"><img src="' + curGalleryItem.find('img').attr('src') + '" alt="" /></a></div>';
        }
        windowHTML +=                   '</div>' +
                                    '</div>' +
                                '</div>';

        windowHTML +=           '<a href="#" class="window-photo-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-close"></use></svg></a>';
        windowHTML +=           '<a href="#" class="window-photo-download" target="_blank" download><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-download"></use></svg></a>';
        windowHTML +=           '<div class="window-photo-social">';
        windowHTML +=               '<div class="window-photo-social-icon"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-share"></use></svg></div>';
        windowHTML +=               '<div class="window-photo-social-window">';
        windowHTML +=                   '<a href="#" class="window-photo-social-item window-photo-social-item-tg"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-share-tg"></use></svg></a>';
        windowHTML +=                   '<a href="#" class="window-photo-social-item window-photo-social-item-link"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-share-link"></use></svg></a>';
        windowHTML +=                   '<a href="#" class="window-photo-social-item window-photo-social-item-vk"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-share-vk"></use></svg></a>';
        windowHTML +=               '</div>';
        windowHTML +=           '</div>';

        windowHTML +=           '<div class="window-photo-slider">' +
                                    '<div class="window-photo-slider-list">';

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.find('.photo-gallery-item').eq(i);
            windowHTML +=               '<div class="window-photo-slider-list-item">' +
                                            '<div class="window-photo-slider-list-item-inner"><img src="' + pathTemplate + 'images/loading.svg" data-src="' + curGalleryItem.find('a').attr('href') + '" alt="" /></div>' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                '</div>';

        windowHTML +=       '</div>';

        $('.window-photo').remove();
        $('body').append(windowHTML);

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);

        $('.window-photo').each(function() {
            var marginPhoto = 166;
            if ($(window).width() < 1206) {
                marginPhoto = 253;
            }
            var newHeight = marginPhoto;
            $('.window-photo-slider-list-item-inner').css({'height': 'calc(100vh - ' + newHeight + 'px)', 'line-height': 'calc(100vh - ' + newHeight + 'px)'});
        });

        if ($(window).width() > 1199) {
            $('.window-photo-preview-inner').mCustomScrollbar({
                axis: 'y',
                scrollButtons: {
                    enable: true
                }
            });
        } else {
            $('.window-photo-preview-inner').mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        }

        $('.window-photo-slider-list').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
            dots: false,
            speed: 250,
            initialSlide: curIndex,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        arrows: false
                    }
                }
            ]
        }).on('setPosition', function(event, slick) {
            var currentSlide = $('.window-photo-slider-list').slick('slickCurrentSlide');
            $('.window-photo-preview-list-item.active').removeClass('active');
            $('.window-photo-preview-list-item').eq(currentSlide).addClass('active');
            $('.window-photo-preview-inner').mCustomScrollbar('scrollTo', $('.window-photo-preview-list-item').eq(currentSlide));
            $('.window-photo-download').attr('href', $('.window-photo-slider-list-item').eq(currentSlide).find('img').attr('data-src'));
            $('.window-photo-social-item-link').attr('data-clipboard-text', $('.window-photo-slider-list-item').eq(currentSlide).find('img').attr('data-src'));
            var curIMG = $('.window-photo-slider-list-item').eq(currentSlide).find('img');
            if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                $('body').append(newIMG);
                newIMG.one('load', function(e) {
                    curIMG.attr('src', curIMG.attr('data-src'));
                    newIMG.remove();
                });
                newIMG.attr('src', curIMG.attr('data-src'));
                window.setTimeout(function() {
                    curIMG.attr('src', curIMG.attr('data-src'));
                    if (newIMG) {
                        newIMG.remove();
                    }
                }, 3000);
            }
        });

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-preview-list-item a', function(e) {
        var curIndex = $('.window-photo-preview-list-item').index($(this).parent());
        $('.window-photo-slider-list').slick('slickGoTo', curIndex);
        e.preventDefault();
    });

    $('body').on('click', '.window-photo-close', function(e) {
        $('.window-photo').remove();
        $('html').removeClass('window-photo-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-photo').length > 0) {
                $('.window-photo-close').trigger('click');
            }
        }
    });

    $('.ckp-social-reviews-link a').click(function(e) {
        var reviewsBlock = $('.ckp-detail-reviews');
        var reviewsTab = reviewsBlock.parents().filter('.tabs-content');
        var curTabs = reviewsTab.parents().filter('.tabs');
        if (!reviewsTab.hasClass('active')) {
            var curIndex = curTabs.find('.tabs-content').index(reviewsTab);
            curTabs.find('.tabs-menu li').eq(curIndex).find('a').trigger('click');
        }
        $('html, body').animate({'scrollTop': curTabs.offset().top - $('header').outerHeight()});
        e.preventDefault();
    });

    $('.is-jur-checkbox').change(function() {
        var curForm = $(this).parents().filter('form');
        if ($(this).prop('checked')) {
            curForm.find('.jur-field').prop('disabled', false);
            curForm.find('.jur-field').addClass('required');
            if (curForm.find('.address-ident-checkbox').prop('checked')) {
                curForm.find('.address-ident').prop('disabled', true);
                curForm.find('.address-ident').removeClass('required');
            }
        } else {
            curForm.find('.jur-field').prop('disabled', true);
            curForm.find('.jur-field').removeClass('required');
        }
    });

    $('.is-jur-checkbox').each(function() {
        var curForm = $(this).parents().filter('form');
        if ($(this).prop('checked')) {
            curForm.find('.jur-field').prop('disabled', false);
            curForm.find('.jur-field').addClass('required');
            if (curForm.find('.address-ident-checkbox').prop('checked')) {
                curForm.find('.address-ident').prop('disabled', true);
                curForm.find('.address-ident').removeClass('required');
            }
        } else {
            curForm.find('.jur-field').prop('disabled', true);
            curForm.find('.jur-field').removeClass('required');
        }
    });

    $('.address-ident-checkbox').change(function() {
        var curForm = $(this).parents().filter('form');
        if ($(this).prop('checked')) {
            curForm.find('.address-ident').prop('disabled', true);
            curForm.find('.address-ident').removeClass('required');
        } else {
            if (curForm.find('.is-jur-checkbox').prop('checked')) {
                curForm.find('.address-ident').prop('disabled', false);
                curForm.find('.address-ident').addClass('required');
            }
        }
    });

    $('.address-ident-checkbox').each(function() {
        var curForm = $(this).parents().filter('form');
        if ($(this).prop('checked')) {
            curForm.find('.address-ident').prop('disabled', true);
            curForm.find('.address-ident').removeClass('required');
        } else {
            if (curForm.find('.is-jur-checkbox').prop('checked')) {
                curForm.find('.address-ident').prop('disabled', false);
                curForm.find('.address-ident').addClass('required');
            }
        }
    });

    $('.contacts-ident-checkbox').change(function() {
        var curForm = $(this).parents().filter('form');
        if ($(this).prop('checked')) {
            curForm.find('.contacts-ident-block input').prop('disabled', true);
            curForm.find('.contacts-ident-block input').removeClass('required');
        } else {
            curForm.find('.contacts-ident-block input').prop('disabled', false);
            curForm.find('.contacts-ident-block input').addClass('required');
        }
    });

    $('.address-ident-checkbox').each(function() {
        var curForm = $(this).parents().filter('form');
        if ($(this).prop('checked')) {
            curForm.find('.contacts-ident-block input').prop('disabled', true);
            curForm.find('.contacts-ident-block input').removeClass('required');
        } else {
            curForm.find('.contacts-ident-block input').prop('disabled', false);
            curForm.find('.contacts-ident-block input').addClass('required');
        }
    });

    $('.header-top-search-link').click(function(e) {
        $('html').toggleClass('search-open');
        if ($('html').hasClass('search-open')) {
            $('.header-search-input input').trigger('focus');
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-search').length == 0 && !$(e.target).hasClass('header-search') && $(e.target).parents().filter('.header-top-search').length == 0 && !$(e.target).hasClass('header-top-search')) {
            $('html').removeClass('search-open');
        }
    });

    $('.wrapper .container table').each(function() {
        var curTable = $(this);
        curTable.wrap('<div class="table-scroll"></div>');
    });

    $('.footer-nav .footer-title').click(function() {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    $('.main-who-item-title').click(function() {
        $(this).parent().parent().toggleClass('open');
        e.preventDefault();
    });

    $('.social-links-icon').click(function() {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.social-links').length == 0) {
            $('.social-links').removeClass('open');
        }
    });

    $('.order-info-block h4').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.megascience-item-text-more a').click(function(e) {
        $(this).parent().prev().toggleClass('open');
        e.preventDefault();
    });

    $('.news-header-filter-link').click(function(e) {
        $('.news-header').toggleClass('open');
        e.preventDefault();
    });

    $('.header-top-user-link').click(function(e) {
        $('html').toggleClass('user-menu-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-top-user').length == 0) {
            $('html').removeClass('user-menu-open');
        }
    });

    $('.header-top-user-menu-nav ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (curLi.find('ul').length == 1) {
            $('.header-top-user-menu').toggleClass('open');
            curLi.toggleClass('open');
            e.preventDefault();
        }
    });

    $('.header-nav').each(function(){
        $('.header-top-left-container').prepend('<div class="header-top-nav-mobile">' + $('.header-nav .container').html() + '</div>');
    });

    $('.header-top-nav-mobile ul li a').click(function(e) {
        var curLI = $(this).parent();
        if (curLI.find('ul').length > 0) {
            curLI.toggleClass('open');
            e.preventDefault();
        }
    });

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

	curForm.find('.form-input input').each(function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

    curForm.find('.form-input input').blur(function(e) {
        $(this).val($(this).val()).change();
    });

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
            toggleSelected: false,
            autoClose: true
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
            dropZone: curFiles.find('.form-files-dropzone'),
            pasteZone: curFiles.find('.form-files-dropzone'),
            add: function(e, data) {
                curFiles.find('.form-files-list').append('<div class="form-files-list-item-progress"><span class="form-files-list-item-cancel"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></span></div>');
                data.submit();
                curFiles.addClass('full');
            },
            done: function (e, data) {
                curFiles.find('.form-files-list-item-progress').eq(0).remove();
                if (data.result.status == 'success') {
                    curFiles.find('.form-files-list').append('<div class="form-files-list-item"><div class="form-files-list-item-icon"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-icon-2"></use></svg><span>' + data.result.ext + '</span></div><div class="form-files-list-item-name">' + data.result.path + '</div><div class="form-files-list-item-size">' + Number(data.result.size).toFixed(2) + ' Мб</div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></div>');
                } else {
                    curFiles.find('.form-files-list').append('<div class="form-files-list-item error"><div class="form-files-list-item-icon"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-icon-2"></use></svg></div><div class="form-files-list-item-name">' + data.result.text + '</div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></div>');
                }
                curFiles.addClass('full');
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
                        if ($(window).width() < 1206) {
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

        $('.window .tabs').each(function() {
            var curTabs = $(this);
            var newHTML = '<ul>';
            curTabs.find('.tabs-content').each(function() {
                newHTML += '<li><a href="#">' + $(this).attr('data-title') + '</a></li>';
            });
            newHTML += '</ul>';
            curTabs.find('.tabs-menu').html(newHTML);
            curTabs.find('.tabs-menu li').eq(0).addClass('active');
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

        curList.find('.catalogue-item-title').css({'min-height': '0px'});

        curList.find('.catalogue-item-title').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.catalogue-item').offset().top;

            curList.find('.catalogue-item-title').each(function() {
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

    $('.manufacturers').each(function() {
        var curList = $(this);

        curList.find('.manufacturers-item-text').css({'min-height': 'auto'});

        curList.find('.manufacturers-item-text').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.manufacturers-item').offset().top;

            curList.find('.manufacturers-item-text').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.manufacturers-item').offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });

        curList.find('.manufacturers-item a').css({'min-height': 'auto'});

        curList.find('.manufacturers-item a').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.manufacturers-item').offset().top;

            curList.find('.manufacturers-item a').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.manufacturers-item').offset().top == curTop) {
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

    if ($(window).width() > 1205) {
        if ($('.table-scroll').length > 0) {
            $('.table-scroll').mCustomScrollbar('destroy');
        }
        if ($('.tabs-menu').length > 0) {
            $('.tabs-menu').mCustomScrollbar('destroy');
        }
    } else {
        if ($('.table-scroll').length > 0) {
            $('.table-scroll').each(function() {
                var curTableScroll = $(this);
                curTableScroll.mCustomScrollbar({
                    axis: 'x',
                    scrollButtons: {
                        enable: true
                    }
                });
            });
        }
        if ($('.tabs-menu').length > 0) {
            $('.tabs-menu').each(function() {
                var curTableScroll = $(this);
                if (curTableScroll.parents().filter('.registration').length == 0) {
                    curTableScroll.mCustomScrollbar({
                        axis: 'x'
                    });
                }
            });
        }
    }

    if ($(window).width() > 1205) {
        if ($('.main-news').length > 0) {
            $('.main-news').mCustomScrollbar('destroy');
        }
    } else {
        if ($('.main-news').length > 0) {
            $('.main-news').each(function() {
                var curTableScroll = $(this);
                if (curTableScroll.parents().filter('.news').length == 0) {
                    curTableScroll.mCustomScrollbar({
                        axis: 'x',
                        scrollButtons: {
                            enable: true
                        }
                    });
                }
            });
        }
    }

    $('.megascience-item-text').each(function() {
        var curBlock = $(this);
        curBlock.removeClass('open with-more');
        if (curBlock.height() < curBlock.find('.megascience-item-text-inner').height()) {
            curBlock.addClass('with-more');
        }
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

function updateCatalogue() {
    $('.catalogue-container').addClass('loading');
    var curForm = $('.catalogue-filter-container form');
    var curData = curForm.serialize();
    curData += '&page=' + $('.pager a.active').attr('data-value');
    curData += '&size=' + $('.catalogue-page-size input:checked').val();
    curData += '&sort=' + $('.catalogue-filter-sort-item a.active').attr('data-value');
    $.ajax({
        type: 'POST',
        url: curForm.attr('action'),
        dataType: 'html',
        data: curData,
        cache: false
    }).done(function(html) {
        $('.catalogue-container').html($(html).find('.catalogue-container').html())
        $('.catalogue-paging .pager').html($(html).find('.pager').html())
        $('.catalogue-results-title-from').html($(html).find('.catalogue-container').attr('data-statusfrom'));
        $('.catalogue-results-title-to').html($(html).find('.catalogue-container').attr('data-statusto'));
        $('.catalogue-results-title-count').html($(html).find('.catalogue-container').attr('data-statuscount'));
        $(window).trigger('resize');
        $('.catalogue-container').removeClass('loading');
        if ($(window).scrollTop() > $('h1').offset().top) {
            $('html, body').animate({'scrollTop': $('h1').offset().top - $('header').outerHeight()});
        }
    });
}