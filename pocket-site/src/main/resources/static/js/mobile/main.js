function initHomeCategories() {
    var carousel = $('#homeCarousel');
    var categoriesImages = carousel.find('a > img');
    var categoriesWidth = categoriesImages.eq(0).width();
    var categoriesHeight = Math.round(categoriesWidth * 0.5841);
    console.log(categoriesWidth);
    categoriesImages.parent().children().width(categoriesWidth);
    categoriesImages.height(categoriesHeight);
    $('#home-carousel-less,#home-carousel-more').css('top', Math.round((categoriesHeight - 35) / 2));
    carousel.carouFredSel({
        direction: 'right',
        responsive: true,
        circular: false,
        infinite: false,
        items: {
            width: categoriesWidth,
            visible: 3
        },
        scroll: {
            items: 3,
            duration: 250
        },
        mousewheel: {
            items: 3,
            duration: 250
        },
        swipe: {
            items: 3,
            duration: 250,
            onTouch: true
        },
        auto: {
            play: false
        },
        prev: {
            button: '.home-carousel-less'
        },
        next: {
            button: '.home-carousel-more'
        }
    });
    var images = $('.search-result-img');
    var width = images.width();
    images.height(Math.round(width * 1.111));
}
function initHomePopup() {
    var homeSelectDatePickerInput = $('#homeSelectDatePickerInput');
    $('#homeSelectDatePicker').datepicker({
        startDate: new Date(),
        language: country
    }).datepicker('update', moment(homeSelectDatePickerInput.val(), 'YYYY-MM-DD').toDate())
        .on('changeDate', function (e) {
            homeSelectDatePickerInput.val(moment(e.date).format('YYYY-MM-DD'))
        });

    var homeTimeHours = $('#home-time-hours');
    var homeTimeHoursInput = homeTimeHours.find('input');
    var homeTimeMinutes = $('#home-time-minutes');
    var homeTimeMinutesInput = homeTimeMinutes.find('input');
    var homeSelectTimePickerInput = $('#homeSelectTimePickerInput');
    var currentTime = moment({h: 0, m: 0, s: 0, ms: 0});
    currentTime.add('minutes', homeSelectTimePickerInput.val());
    function updateTime(modification) {
        return function () {
            currentTime.add('minutes', modification);
            homeTimeHoursInput.val(currentTime.format('HH'));
            homeTimeMinutesInput.val(currentTime.format('mm'));
            udpateSelectTimePickerInput();
        };
    }

    function udpateSelectTimePickerInput() {
        var midnight = moment(currentTime).hours(0).minutes(0).seconds(0);
        homeSelectTimePickerInput.val(currentTime.diff(midnight, 'minutes'));
    }

    updateTime(0)();
    homeTimeHours.find('.btn:first-of-type').on('click', updateTime(60));
    homeTimeHours.find('.btn:last-of-type').on('click', updateTime(-60));
    homeTimeMinutes.find('.btn:first-of-type').on('click', updateTime(1));
    homeTimeMinutes.find('.btn:last-of-type').on('click', updateTime(-1));
    homeTimeHoursInput.on('change', function () {
        var newValue = parseInt($(this).val()) || 0;
        if (newValue < 0 || newValue > 23) {
            $(this).val('00');
            currentTime.hour(0);
        } else {
            currentTime.hour(newValue);
        }
        udpateSelectTimePickerInput();
    });
    homeTimeMinutesInput.on('change', function () {
        var newValue = parseInt($(this).val(), 10) || 0;
        if (newValue < 0 || newValue > 59) {
            $(this).val('00');
            currentTime.minute(0);
        } else {
            currentTime.minute(newValue);
        }
        udpateSelectTimePickerInput();
    });

    var firstResult = null;
    var locationEngine = new Bloodhound({
        name: 'locationSearch',
        limit: 20,
        remote: {
            url: '/search/cities?query=%QUERY',
            rateLimitBy: 'throttle',
            rateLimitWait: 300,
            filter: function (response) {
                var results = [];
                $.each(response['cities'], function (index, city) {
                    city.name = city.name.split('|')[0];
                    results.push(city);
                });
                firstResult = results[0];
                return results;
            }
        },
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    locationEngine.initialize();

    var homeSelectCityInput = $('#homeSelectCityInput');
    $('#homeSelectCity').on('shown.bs.modal', function (e) {
        homeSelectCityInput.focus().select();
    });

    var homeSelectCityCountryInput = $('#homeSelectCityCountryInput');
    var homeSelectCityLatInput = $('#homeSelectCityLatInput');
    var homeSelectCityLonInput = $('#homeSelectCityLonInput');
    function updateHomeSelectCity(datum) {
        homeSelectCityCountryInput.val(datum.country);
        homeSelectCityLatInput.val(datum.location['x']);
        homeSelectCityLonInput.val(datum.location['y']);
    }
    var citiesResultTemplate = Hogan.compile(
        '<p style="white-space: normal;"><strong>{{name}}</strong><span class="small">{{postalCode}}</span></p>'
    );
    homeSelectCityInput.typeahead(
        {
            minLength: 2,
            highlight: true,
            autoselect: true
        },
        {
            name: 'city',
            displayKey: "name",
            source: locationEngine.ttAdapter(),
            templates: {
                empty: noResultsFoundText,
                suggestion: function (data) {
                    return citiesResultTemplate.render(data);
                }
            }
        }
    ).on("typeahead:selected typeahead:autocompleted", function (e, datum) {
            updateHomeSelectCity(datum);
        }).on("change", function () {
            updateHomeSelectCity({
                country: '',
                location: {
                    x: '',
                    y: ''
                },
                postalCode: ''
            });
        }).blur(function () {
            if (firstResult.name == $(this).val()) {
                updateHomeSelectCity(firstResult);
                return;
            }

            if (!homeSelectCityLatInput.val() || !homeSelectCityLonInput.val()) {
                $(this).val("");
            }
        }).on('keyup', function(e) {
            if(e.which == 13) {
                $(this).closest('form').submit();
            }
        });

    $('#homeSelectCityForm').find('.tt-dropdown-menu').mCustomScrollbar({
        theme: "dark",
        scrollInertia: 0,
        scrollbarPosition: 'outside'
    });

    $('#homeSelectCityForm').submit(function() {
        if (homeSelectCityLatInput.val() != '' && homeSelectCityLonInput.val() != '') {
            return true;
        }
        if (firstResult == null) {
            return false;
        }

        homeSelectCityInput.val(firstResult.name);
        updateHomeSelectCity(firstResult);
        return true;
    });
}
function initWeatherWidget() {
    var weatherWidget = $('#weatherWidget');
    var weatherWidgetDate = $('#weatherWidgetDate');
    var weatherWidgetCity = $('#weatherWidgetCity');
    var weatherWidgetIcon = $('#weatherWidgetIcon');
    var weatherWidgetTemperature = $('#weatherWidgetTemperature');
    var weatherWidgetDescription = $('#weatherWidgetDescription');
    $.getJSON("/weather", function (data) {
        if (data['validResponse']) {
            data['date'][1]--;
            weatherWidgetDate.html(moment(data['date']).format('dddd, Do MMMM'));
            weatherWidgetCity.html(data['city']);
            weatherWidgetIcon.attr('src', '/img/weather/' + data['icon'] + '.png');
            weatherWidgetTemperature.html(data['temperature'] + "°C");
            weatherWidgetDescription.html(data['description']);
            weatherWidget.fadeIn('fast');
        } else {
            weatherWidget.fadeOut('fast');
        }
    });
}
function initHomeSelect() {
    var openned = false;
    var mySelectChoices = $('#mySelectChoices');
    var mySelectButton = $('#mySelectButton');
    mySelectButton.click(function() {
        openned = true;
        mySelectChoices.show();
        return false;
    });
    mySelectChoices.find('input').change(function() {
        window.location = $(this).data('href');
        return false;
    });
    mySelectChoices.find('.delete').click(function() {
        if (openned) {
            openned = false;
            mySelectChoices.hide();
            return false;
        }
    });
    $('.home-results .search-result-name').dotdotdot();
}
var SEARCH_RESULTS_MAP = null;
var SEARCH_RESULTS_MARKERS = {};
function clearOverlays() {
    for (id in SEARCH_RESULTS_MARKERS) {
        var marker = SEARCH_RESULTS_MARKERS[id];
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
    }
    SEARCH_RESULTS_MARKERS = {};
}
function initSearchResultsMap() {
    $('.search-result-list .search-result').on('mouseenter', function () {
        var id = $(this).data('id');
        if (!SEARCH_RESULTS_MARKERS[id]) {
            return;
        }
        SEARCH_RESULTS_MARKERS[id].setIcon('/img/blue-pin.png');
    }).on('mouseleave', function () {
        var id = $(this).data('id');
        if (!SEARCH_RESULTS_MARKERS[id]) {
            return;
        }
        SEARCH_RESULTS_MARKERS[id].setIcon('/img/red-pin.png');
    });
    SEARCH_RESULTS_MAP = new google.maps.Map(document.getElementById("map-canvas"), {
        center: new google.maps.LatLng(searchLat, searchLng),
        mapTypeControl: false,
        streetViewControl: false,
        zoom: 13
    });
}
function drawMarkers(visibleItems) {
    var bounds = new google.maps.LatLngBounds();
    var children = visibleItems.children('.search-result');
    children.each(function (index, item) {
        var latLng = new google.maps.LatLng($(item).data('lat'), $(item).data('lng'));
        var marker = new google.maps.Marker({
            position: latLng,
            title: $(item).data('name'),
            animation: false,
            map: SEARCH_RESULTS_MAP,
            icon: "/img/red-pin.png"
        });
        google.maps.event.addListener(marker, 'mouseover', function () {
            this.setIcon('/img/blue-pin.png');
            $(item).addClass('hover');
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            this.setIcon('/img/red-pin.png');
            $(item).removeClass('hover');
        });
        google.maps.event.addListener(marker, 'click', function () {
            window.location.href = $(item).children('a').attr('href');
        });
        SEARCH_RESULTS_MARKERS[$(item).data('id')] = marker;
        bounds.extend(latLng);
        if (children.size() == 1) {
            SEARCH_RESULTS_MAP.setCenter(latLng);
            SEARCH_RESULTS_MAP.setZoom(12);
        }
    });
    if (children.size() > 1) {
        SEARCH_RESULTS_MAP.fitBounds(bounds);
    }
}
function ellipsis(visibleItems) {
    visibleItems.find('.search-result-name').dotdotdot({
        height: 52
    });
}
function initSearchResults() {
    $('#searchResultsCarousel').carouFredSel({
        direction: 'up',
        circular: false,
        infinite: false,
        items: {
            visible: 2
        },
        scroll: {
            items: 2,
            duration: 250,
            onBefore: clearOverlays,
            onAfter: function (data) {
                drawMarkers(data.items.visible);
                ellipsis(data.items.visible);
            }
        },
        mousewheel: {
            items: 2,
            duration: 250
        },
        auto: {
            play: false
        },
        prev: {
            button: '.home-carousel-less'
        },
        next: {
            button: '.home-carousel-more'
        }
    }).trigger('currentVisible', function (visibles) {
        drawMarkers(visibles);
        ellipsis(visibles);
    });
}
function initFavorites() {
    $('#favoriteTagsContainerSite,#favoriteTagsContainerEvent').mCustomScrollbar({
        scrollInertia: 0,
        scrollbarPosition: 'inside'
    });
    $('.favorite-remove').click(function() {
        var form = $(this).parent();
        $.post(form.attr('action'), form.serialize(), function () {
            window.location.reload();
        });
        return false;
    });
}
function autoResizeLines() {
    setTimeout(function() {
        $('.auto-resize-line').each(function() {
            var height = $(this).height();
            var children = $(this).find('span');
            if (children.height() > height) {
                $(children).css({
                    'line-height': (height / 2) + 'px'
                });
                if (children.height() > height) {
                    $(children).dotdotdot();
                }
            }
        });
    }, 150);
}

function initLayout() {
    var headerPopupSearchModal = $('#headerPopupSearchModal');
    var headerPopupSearchInput = $('#headerPopupSearchInput');
    var headerPopupSearchClear = $('#headerPopupSearchClear');
    var headerSearchInput = $('#headerSearchInput');
    var searchPopupForm = $('#searchPopupForm');

    var engine = new Bloodhound({
        name: 'headerSearch',
        limit: '100',
        remote: {
            url: '/search/fuzzy?query=%QUERY',
            rateLimitBy: 'throttle',
            rateLimitWait: 300,
            filter: function (response) {
                var results = [];
                $.each(response['sites'], function (index, site) {
                    results.push(site);
                });
                return results;
            }
        },
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    engine.initialize();
    headerPopupSearchModal.on('shown.bs.modal', function () {
        headerPopupSearchInput.focus().typeahead('val', headerSearchInput.val());
        headerSearchInput.val('');
    }).on('hidden.bs.modal', function () {
        headerPopupSearchInput.typeahead('val', '');
    });
    headerSearchInput.on('click', function () {
        headerPopupSearchInput.attr('placeholder', headerPopupSearchInput.data('placeholder'));
        headerPopupSearchModal.modal('show');
        headerPopupSearchModal.find('.tt-dropdown-menu').mCustomScrollbar({
            theme: "dark",
            scrollInertia: 0,
            scrollbarPosition: 'outside'
        });
    });
    var headerPopupSearchTemplate = Hogan.compile([
        '<div class="row search-result-container">',
        '<div class="col-lg-12 text-left">',
        '<img src="{{displayImageUrl}}" class="pull-left" width="60" height="58" />',
        '{{#rating}}<div class="search-result-rating pull-right">{{average}}</div>{{/rating}}',
        '<h2 class="no-margin">{{name}}</h2>',
            '<span class="search-result-description">{{address.city}} {{#mainThemes.' + country + '}}| {{mainThemes.' + country + '}}{{/mainThemes.' + country + '}}</span>',
        '</div>',
        '</div>'
    ].join(''));
    headerPopupSearchInput.typeahead(
        {
            hint: false,
            minLength: 2,
            highlight: true
        },
        {
            name: 'headerSearch',
            displayKey: "name",
            source: engine.ttAdapter(),
            templates: {
                empty: noResultsFoundText,
                suggestion: function (data) {
                    if (data['rating'] && !data['rating']['average']) {
                        delete data['rating'];
                    }
                    return headerPopupSearchTemplate.render(data);
                }
            }
        }
    ).unbind('blur')
        .on('typeahead:selected', function (object, datum) {
            window.location.href = datum['detailsUrl'];
            return false;
        });
    headerPopupSearchInput.on('propertychange keyup input paste', function() {
        var io = $(this).val().length ? 1 : 0;
        headerPopupSearchClear.stop().fadeTo(150, io);
    });
    headerPopupSearchClear.click(function() {
        headerPopupSearchInput.typeahead('val', '');
        headerPopupSearchInput.attr('placeholder', '').focus();
        headerPopupSearchClear.stop().fadeOut(150);
    });

    var togglingFooter = false;

    function toggleFooter(height, visibleFooter, hiddenFooter) {
        if (togglingFooter) {
            return;
        }
        togglingFooter = true;
        var footer2 = $(visibleFooter).fadeOut('fast');
        var body = $('body').velocity({
            'margin-bottom': height + 40
        }).promise();
        var footer = $('footer').velocity({
            'height': height
        }).promise();
        $.when(footer, footer2, body).done(function () {
            $(hiddenFooter).fadeIn('fast', function () {
                togglingFooter = false;
            });
            $("html, body").animate({ scrollTop: $(document).height() });
        });
    }

    $('#show-footer, #language-selector').on('click', function () {
        toggleFooter(176, '#footer-small', '#footer-large');
    });
    $('#hide-footer').on('click', function () {
        toggleFooter(68, '#footer-large', '#footer-small');
    });

    $('.js-submit-form').on('click', function () {
        var form = $(this).closest("form");
        var source = $(this).data('source');
        if (source) {
            form.find('#source').val(source);
        }
        form.submit();
        return false;
    });
    $('.js-modal-close').on('click', function () {
        $(this).closest('.modal').modal('hide');
    });
    var registerPopup = $('#registerModal');
    var registerSuccessPopup = $('#registerCompleteModal');
    var registerForm = $("#registerForm");
    var registerFormValidator = registerForm.validate({
        rules: {
            name: {
                required: true
            },
            password: {
                required: true
            },
            confirmPassword: {
                required: true,
                equalTo: "#registerPassword"
            },
            email: {
                required: true,
                email: true
            },
            terms: {
                required: true
            }
        },
        onkeyup: function (element) {
            return $(element).valid();
        },
        success: function (label) {
            label.addClass("valid").text($.validator.messages.completed);
        },
        errorPlacement: function (error, element) {
            element.closest(".row").find('.error-container').append(error);
        },
        submitHandler: function (form) {
            registerForm.ajaxSubmit({
                dataType: 'json',
                beforeSubmit: function(arr, $form, options) {
                    var fileDataIndex = -1;

                    $.each(arr, function(index, value) {
                        if (value.name == "avatar") {
                            if (value.value.length == 0){
                                fileDataIndex = index;
                            }
                        }
                    });

                    if (fileDataIndex != -1) {
                        delete arr[fileDataIndex];
                    }
                },
                success: function(result) {
                    if (result.success == true) {
                        registerPopup.modal('hide');
                        registerSuccessPopup.modal('show');
                    } else {
                        $('#' + result.field + 'ErrorContainer').html('<label for="' + result.field + '" class="error">' + result.error + '</label>');
                    }
                }
            });
            return false;
        }
    });

    var facebookCurrentProfile;
    var registerSelectedAvatar = $('#registerSelectedAvatar');
    var accountCurrentAvatarImage = $('#accountCurrentAvatarImage');
    var accountDefaultAvatarInput = $('#accountDefaultAvatarInput');
    var registerFacebookPictureUrl = $('#registerFacebookPictureUrl');
    var triggerFacebook = window.location.search.indexOf("facebook=true") != -1;
    var PICTURE_URL = "http://graph.facebook.com/{{userID}}/picture?width=158&height=158&type=square";
    window.registerFbInitDone = function() {
        if (triggerFacebook) {
            registerPopup.modal('show');
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    var userId = response.authResponse.userID;
                    FB.api('/me', function (meResponse) {
                        facebookCurrentProfile = meResponse;
                        registerPopup.modal('show');
                    });
                    var pictureUrl = PICTURE_URL.replace("{{userID}}", userId);
                    accountCurrentAvatarImage.add(registerSelectedAvatar)
                        .add(registerFacebookPictureUrl).attr('src', pictureUrl);
                    accountDefaultAvatarInput.val(pictureUrl);
                } else {
                    facebookCurrentProfile = null;
                    registerPopup.modal('show');
                }
            });
        }
    };
    var registerPictureFormContent = $('#registerPictureFormContent');
    var registerMainFormContent = $('#registerMainFormContent');
    registerPopup.on('show.bs.modal', function () {
        registerMainFormContent.show();
        registerPictureFormContent.hide();
        registerFormValidator.resetForm();
        if (triggerFacebook && facebookCurrentProfile) {
            registerPopup.addClass('register-popup-facebook');
            $('#registerUsername').val(facebookCurrentProfile.name);
            $('#registerPassword').val('');
            $('#registerConfirmPassword').val('');
            $('#registerEmail').val(facebookCurrentProfile.email);
            $('#registerLanguage').val(facebookCurrentProfile.locale);
        } else {
            registerPopup.removeClass('register-popup-facebook');
        }
    });
    $('#registerPictureSaveButton').click(function() {
        registerPictureFormContent.fadeOut('fast', function() {
            registerMainFormContent.fadeIn('fast');
        });
    });
    $('#registerSelectAvatarLink').add(registerSelectedAvatar).click(function() {
        registerMainFormContent.fadeOut('fast', function() {
            registerPictureFormContent.fadeIn('fast');
        });
    });
    $('.js-register-login').on('click', function () {
        window.location.reload();
    });
    $('.navbar-dropdown input').on('click', function (e) {
        e.stopPropagation();
    });
    autoResizeLines();
    $('#myFavoriteButton').tooltip({
        trigger: 'click',
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
    });
    var searchStreamOpened = false;
    var searchStream = $('#searchStream');
    var searchStreamButton = $('#searchStreamButton');
    var searchStreamResults = $('#searchStreamResults');
    var searchStreamClearAll = $('#searchStreamClearAll');
    var searchStreamResultsTemplate = Hogan.compile([
        '{{#reverseEntries}}',
            '<div class="row">',
                '<div class="col-lg-12 text-left">',
                    '<a href="' + searchStreamResults.data('url') + '?history=add" class="search-stream-separator">',
                        '<img src="{{displayImageUrl}}" class="pull-left" width="45" height="36" />',
                        '<span class="search-stream-date">{{dateFromNow}}</span>',
                        '<p class="no-margin"><span>{{name}}</span></p>',
                    '</a>',
                '</div>',
            '</div>',
        '{{/reverseEntries}}'
    ].join(''));
    function openSearchStream() {
        $.get('/history', function(data) {
            if (!data['entries'] || data['entries'].length <= 0) {
                searchStreamClearAll.hide();
                searchStreamResults.html('<div class="search-stream-empty">' + noRecentActivityText + '</div>');
                return;
            }
            searchStreamClearAll.show();
            data['reverseEntries'] = [];
            for (var i = data['entries'].length - 1; i >= 0 ; i--) {
                data['entries'][i]['dateTime'][1] = data['entries'][i]['dateTime'][1] - 1;
                data['entries'][i]['dateFromNow'] = moment(data['entries'][i]['dateTime']).fromNow();
                data['reverseEntries'].push(data['entries'][i]);
            }
            searchStreamResults.html(searchStreamResultsTemplate.render(data));
            searchStreamResults.find('p').each(function() {
                var children = $(this).find ('span');
                if (children.height() > 28) {
                    $(children).css({
                        'line-height': '14px'
                    });
                    if (children.height() > 28) {
                        $(children).dotdotdot();
                    }
                }
            });
            searchStreamResults.mCustomScrollbar({
                scrollInertia: 0,
                scrollbarPosition: 'inside'
            });
        });
        searchStreamButton.velocity({
            'left': '0'
        }, 100, function() {
            searchStream.velocity({
                'right': '0'
            }, 250);
        });
        searchStreamOpened = true;
    }
    function closeSearchStream() {
        searchStream.velocity({
            'right': '-220px'
        }, 250, function() {
            searchStreamButton.velocity({
                'left': '-38px'
            }, 100);
        });
        searchStreamOpened = false;
    }
    searchStreamButton.click(function() {
            if (searchStreamOpened) {
                closeSearchStream();
            } else {
                openSearchStream();
            }
        }
    );
    searchStreamClearAll.click(function() {
        var form = $(this).closest('form');
        $.post(form.attr('action'), form.serialize(), function(data) {
            searchStreamClearAll.hide();
            searchStreamResults.html('<div class="search-stream-empty">' + noRecentActivityText + '</div>');
            searchStreamButton.click();
        });
        return false;
    });
    searchStream.click(function(e) {
        e.stopPropagation();
        return true;
    });
    $(document).click(function() {
        if (searchStreamOpened) {
            closeSearchStream();
        }
    });

    var registerWithFacebook = $('#registerWithFacebook');
    var registerWithFacebookForm = $('#registerWithFacebookForm');
    registerWithFacebook.click(function() {
        registerWithFacebookForm.submit();
    });

    var contactUsSubmitButton = $('#contactUsSubmitButton');
    var contactUsModal = $('#contactUsModal');
    var contactUsForm = $('#contactUsForm');
    var contactUsCompleteModal = $('#contactUsCompleteModal');
    contactUsForm.validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        onkeyup: function (element) {
            return $(element).valid();
        },
        errorPlacement: function (error, element) {
            // NOOP
        },
        submitHandler: function (form) {
            contactUsSubmitButton.button('loading');
            $.post(contactUsForm.attr('action'), contactUsForm.serialize(), function(data) {
                contactUsForm.resetForm();
                contactUsModal.modal('hide');
                contactUsCompleteModal.modal('show');
            });
            return false;
        }
    });
    $('#contactUsCancel').click(function() {
        contactUsModal.modal('hide');
    });
    contactUsModal.on('show.bs.modal', function (e) {
        contactUsSubmitButton.button('reset');
    });

    // MENU

    var mobileMenu = $('#mobileMenu');
    var mobileMenuIsOpen = false;
    var toggleMobileMenu = function () {
        if (mobileMenuIsOpen) {
            mobileMenu.velocity({
                'left': '-280px'
            }, 200);
        } else {
            mobileMenu.velocity({
                'left': '0'
            }, 200);
        }
        mobileMenuIsOpen = !mobileMenuIsOpen;
    };
    $('#navbarMenuButton').click(toggleMobileMenu);
    if (loginError) {
        $('#loginDropdownToggle').dropdown('toggle');
    }
    var mobileMenuPanels = mobileMenu.find('.nav-submenu');
    var mobileMenuLinks = mobileMenu.find('.js-active-dropdown');
    mobileMenuLinks.click(function() {
        var current = $(this);
        var needOpen = !current.hasClass('openned');
        mobileMenuLinks.removeClass('openned');
        mobileMenuPanels.stop(true, true).slideUp('fast');
        if (needOpen) {
            current.addClass('openned');
            current.children('.nav-submenu').stop(true, true).slideDown('fast');
        }
    });

    $('.js-previous-page-button').click(function() {
        history.back();
        return false;
    });
}

$.fn.toggleClick = function(){
    var methods = arguments, // store the passed arguments for future reference
        count = methods.length; // cache the number of methods

    //use return this to maintain jQuery chainability
    return this.each(function(i, item){
        // for each element you bind to
        var index = 0; // create a local counter for that element
        $(item).click(function(){ // bind a click handler to that element
            return methods[index++ % count].apply(this,arguments); // that when called will apply the 'index'th method to that element
            // the index % count means that we constrain our iterator between 0 and (count-1)
        });
    });
};

function isYoutubeVideo(videoUrl) {
    return videoUrl && videoUrl.indexOf("youtube") > -1;
}
function isDailyMotionVideo(videoUrl) {
    return videoUrl && videoUrl.indexOf("dailymotion") > -1;
}
function getYoutubeVideoId(videoUrl) {
    var res = /https?:\/\/www\.youtube\.com\/watch\?v=([^&]+)/.exec(videoUrl);
    if (res && res.length > 1) {
        return res[1];
    }
}
function getDailyMotionVideoId(videoUrl) {
    var res = /https?:\/\/www\.dailymotion\.com\/video\/([^_]+)_/.exec(videoUrl);
    if (res && res.length > 1) {
        return res[1];
    }
}
function initAndGetVideoId(videoUrl) {
    if (isYoutubeVideo(videoUrl)) {
        $.getScript('https://www.youtube.com/iframe_api');
        return getYoutubeVideoId(videoUrl);
    } else if (isDailyMotionVideo(videoUrl)) {
        $.getScript("https://api.dmcdn.net/all.js");
        return getDailyMotionVideoId(videoUrl);
    }
    return "";
}
function initDetails() {
    var detailsTabContainer = $('#detailsInfoContainer');
    var allDetailsTab = $('.js-details-tab');
    function toggleCurrentTab() {
        if ($(this).hasClass('active')) {
            return false;
        }
        allDetailsTab.removeClass('active');
        $(this).addClass('active');
        var target = $(this).data('target');
        detailsTabContainer.children().slideUp('fast', function () {
            detailsTabContainer.children(target).slideDown('fast');
        });
        return false;
    }
    var detailsCommentsContainer = $('#detailsCommentsContainer');
    var detailsDisplayAddComments = $('#detailsDisplayAddComments');
    var detailsAddCommentContainer = $('#detailsAddCommentContainer');
    var detailsDisplayAddComment = $('#detailsDisplayAddComment');
    var detailsDisplayReportComment = $('#detailsDisplayReportComment');
    var detailsAddCommentForm = $('#detailsAddCommentForm');
    var detailsCommentsCount = $('#detailsCommentsCount');
    var detailsCommentsList = $('#detailsCommentsList');
    allDetailsTab.on('click', toggleCurrentTab);
    var detailsActionPanels = $('.details-action-panel');
    var detailsRightPanel = $('#detailsRightPanel');
    var detailsActions = $('.js-details-action-opening');
    var detailsCommentsClose = $('#detailsCommentsClose');
    var commentsResultsTemplate = Hogan.compile([
        '{{#reverseComments}}',
        '<div class="details-comment">',
            '<img src="{{imageUrl}}" width="44" height="44" class="img-circle" />',
            '<span class="details-comment-name">{{name}}</span>',
            '<div class="details-comment-text">',
                '<p>{{text}}</p>',
                '<span>{{formattedDate}}</span>',
                '<button type="button" class="btn btn-comment-report" id="detailsDisplayReportComment">Alert</button>',
            '</div>',
        '</div>',
        '{{/reverseComments}}'
    ].join(''));
    function loadComments() {
        $.get('/subjects/comments', {id: detailsCommentsContainer.data('site-id')}, function(data) {
            if (!data['comments'] || data['comments'].length <= 0) {
                detailsCommentsList.html('<div class="details-comment-empty">' + noCommentsText + '</div>');
                detailsCommentsCount.html(0);
                return;
            }
            var commentsCount = data['comments'].length;
            data['reverseComments'] = [];
            for (var i = commentsCount - 1; i >= 0 ; i--) {
                data['comments'][i]['formattedDate'] = moment(data['comments'][i]['date']).format("D MMM YYYY");
                data['reverseComments'].push(data['comments'][i]);
            }
            detailsCommentsCount.html(commentsCount);
            detailsCommentsList.mCustomScrollbar("destroy");
            detailsCommentsList.html(commentsResultsTemplate.render(data));
            detailsCommentsList.mCustomScrollbar({
                scrollInertia: 0,
                scrollbarPosition: 'outside'
            });
        });
    }
    function toggleAction() {
        var openPanel = !$(this).hasClass('details-action-panel-opened');
        detailsActions.removeClass('details-action-panel-opened');
        detailsActionPanels.add(detailsDisplayAddComments).add(detailsDisplayAddComment).fadeOut('fast');
        if (openPanel) {
            var isComments = $(this).hasClass('details-comments');
            $(this).addClass('details-action-panel-opened');
            var children = $(this).children();
            if (isComments)  {
                detailsAddCommentContainer.hide();
                children = children.not(detailsAddCommentContainer).not(detailsDisplayAddComment);
            }
            children.fadeIn('fast');
        }
        return false;
    }
    detailsCommentsContainer.add(detailsAddCommentContainer).add(detailsDisplayAddComment).click(function() {
        return false;
    });
    detailsCommentsClose.on('click', toggleAction);
    detailsActions.on('click', toggleAction)
        .mousedown(function(event) {
            if ($(event.target).hasClass('details-action')) {
                event.preventDefault();
            }
        });
    var detailsRatingForm = $('#detailsRating');
    var detailsRatingCount = $('#detailsRatingCount');
    var detailsRatingAverage = $('#detailsRatingAverage');
    var detailsRatingVotes = $('#detailsRatingVotes');
    var detailsRatingClose = $('#detailsRatingClose');
    function resetStars() {
        var rating = detailsRatingCount.text() - 1;
        if (rating == -1) {
            detailsRatingForm.children('.details-rating-star').attr('src', '/img/rating-gray.png');
        } else {
            var currentRating = detailsRatingForm.children('.details-rating-star:eq(' + rating + ')');
            currentRating.prevAll().andSelf().attr('src', '/img/rating-blue.png');
            currentRating.nextAll(".details-rating-star").attr('src', '/img/rating-gray.png');
        }
    }
    detailsRatingClose.mouseenter(resetStars).click(toggleAction);
    detailsRatingForm.mouseleave(
        resetStars
    ).children('.details-rating-star').click(function () {
        var rating = $(this).data('rating');
        var url = detailsRatingForm.attr('action') + '?' + detailsRatingForm.serialize()
            + '&rating=' + rating;
        $.post(url, function (result) {
            detailsRatingCount.parent().removeClass('details-rating-empty')
            detailsRatingCount.text(rating);
            detailsRatingAverage.text(result['average']);
            detailsRatingVotes.text(detailsRatingVotes.data('text').replace('{0}', result['votes']));
            return false;
        });
    }).mouseenter(function () {
        $(this).prevAll().andSelf().attr('src', '/img/rating-blue.png');
        $(this).nextAll(".details-rating-star").attr('src', '/img/rating-gray.png');
    });
    var detailsFavorite = $('#detailsFavorite');
    var detailsFavoriteForm = $('#detailsFavoriteForm');
    detailsFavorite.click(function() {
        var isFavorite = detailsFavorite.hasClass('details-favorite-active');
        var url = detailsFavoriteForm.attr('action') + '?' + detailsFavoriteForm.serialize()
            + '&favorite=' + (isFavorite ? 'false' : 'true');
        $.post(url, function (result) {
            if (isFavorite) {
                detailsFavorite.removeClass('details-favorite-active');
            } else {
                detailsFavorite.addClass('details-favorite-active');
            }
            return false;
        });
    });
    function resizePanels() {
        var width = detailsRightPanel.width() + 30;
        detailsActionPanels.css('width', width);
        detailsDisplayAddComments.add(detailsDisplayAddComment).css('right', -width);
    }
    resizePanels();
    $(window).resize(resizePanels);
    $('.details-actions .details-action').tooltip({
        trigger: 'click',
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
    });
    detailsDisplayAddComments.click(function(event) {
        event.stopPropagation();
        detailsCommentsContainer.add(detailsDisplayAddComments).fadeOut('fast', function() {
            detailsAddCommentContainer.add(detailsDisplayAddComment).fadeIn('fast');
        });
        return false;
    });
    detailsDisplayAddComment.click(function(event) {
        event.stopPropagation();
        var textarea = detailsAddCommentForm.find('textarea');
        if (textarea.val() == "") {
            toggleAction();
            return false;
        }
        $.post(detailsAddCommentForm.attr('action'), detailsAddCommentForm.serialize(), function(data) {
            textarea.val("");
            loadComments();
            detailsAddCommentContainer.add(detailsDisplayAddComment).fadeOut('fast', function() {
                detailsCommentsContainer.add(detailsDisplayAddComments).fadeIn('fast');
            });
        });
        return false;
    });
    if (loggedInUser != null) {
        loadComments();
    }
    var player;
    var imageContainer = $('#imageContainer');
    var detailsPlay = $('#detailsPlay');
    var videoPlayer = $('#videoPlayer');
    var detailsImage = $('#detailsImage');
    /*var detailsActionsContainer = $('#detailsActions');
    var detailsActionsVideo = $('#detailsActionsVideo');
    var detailsImageWidth = detailsImage.width();
    var detailsImageHeight = detailsImage.height();
    var videoId = "";*/

    setTimeout(function() {
        detailsPlay.fadeIn('fast');
    }, 500);

    /*window['onYouTubeIframeAPIReady'] = function() {
        player = new YT.Player('videoPlayer', {
            height: detailsImageHeight,
            width: detailsImageWidth - 1,
            videoId: videoId,
            playerVars: {
                controls: 1,
                autohide: 1,
                modestbranding: 0,
                showinfo: 0,
                autoplay: 0
            },
            events: {
                'onReady': function() {
                    videoPlayer = $('#videoPlayer');
                    detailsPlay.fadeIn('fast');
                },
                'onStateChange': function(evt) {
                    if (evt.data == 2 || event.data == 0) {
                        videoPlayer.add(detailsActionsVideo).hide();
                        imageContainer.add(detailsPlay).add(detailsActionsContainer).fadeIn('fast');
                    }
                }
            }
        });
    };
    window['dmAsyncInit'] = function() {
        player = DM.player("videoPlayer", {
            height: detailsImageHeight,
            width: detailsImageWidth - 1,
            video: videoId,
            params: {
                logo: 0,
                info: 0,
                autoplay: 0
            }
        });
        player.addEventListener("apiready", function(e) {
            videoPlayer = $('#videoPlayer');
            detailsPlay.fadeIn('fast');
        });
        player.addEventListener("pause", function() {
            videoPlayer.add(detailsActionsVideo).hide();
            imageContainer.add(detailsPlay).add(detailsActionsContainer).fadeIn('fast');
        });
        player.addEventListener("ended", function() {
            videoPlayer.add(detailsActionsVideo).hide();
            imageContainer.add(detailsPlay).add(detailsActionsContainer).fadeIn('fast');
        });
    };

    var res;
    var videoUrl = videoPlayer.data('src');
    if (videoUrl) {
        if (videoUrl.indexOf("youtube") > -1) {
            res = /https?:\/\/www\.youtube\.com\/watch\?v=([^&]+)/.exec(videoUrl);
            if (res && res.length > 1) {
                videoId = res[1];
                $.getScript('https://www.youtube.com/iframe_api');
            }
        } else if (videoUrl.indexOf("dailymotion") > -1) {
            res = /https?:\/\/www\.dailymotion\.com\/video\/([^_]+)_/.exec(videoUrl);
            if (res && res.length > 1) {
                videoId = res[1];
                $.getScript("https://api.dmcdn.net/all.js");
            }
        }
    }*/

    /*detailsImage.height(detailsImageHeight);
    detailsPlay.click(function() {
        imageContainer.add(detailsPlay).add(detailsActionsContainer).hide();
        if (typeof player.play != 'undefined') {
            window.setTimeout(function() {player.play();}, 500);
        } else if (typeof player.playVideo != 'undefined') {
            player.playVideo();
        }
        videoPlayer.add(detailsActionsVideo).fadeIn('fast');
    });*/

    var currentPageUrl = $('meta[property="og:url"]').attr("content");
    var currentPageUrlEncoded = encodeURIComponent(currentPageUrl);
    $('#googleShare').click(function() {
        var width = 600;
        var height = 600;
        var leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        var topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition +
            ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition +
            ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
        var shareUrl = "https://plus.google.com/share?url=" + currentPageUrlEncoded;
        var newWindow = window.open(shareUrl, '', windowFeatures);
        if (window.focus) {
            newWindow.focus()
        }
    });
    $('#facebookShare').click(function() {
        FB.ui({
            method: 'share_open_graph',
            action_type: 'og.likes',
            action_properties: JSON.stringify({
                object: currentPageUrl
            })
        }, function(response){
        });
    });
    $('#detailsShareFacebook').click(function() {
        FB.ui({
            method: 'share_open_graph',
            action_type: 'og.likes',
            action_properties: JSON.stringify({
                object: videoPlayer.data('src')
            })
        }, function(response){
        });
    });
    $('#twitterShare').click(function() {
        var width = 550;
        var height = 260;
        var leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        var topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition +
            ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition +
            ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
        var shareUrl = "https://twitter.com/intent/tweet?via=citibreak%20"
            + encodeURIComponent(twitterViaText)
            + "&original_referer=" + encodeURIComponent(window.location.href)
            + "&url=" + currentPageUrlEncoded
            + "&text=" + encodeURIComponent($('meta[property="og:title"]').attr("content"));
        var newWindow = window.open(shareUrl, '', windowFeatures);
        if (window.focus) {
            newWindow.focus()
        }
    });
    $('#detailsShareTwitter').click(function() {
        var width = 550;
        var height = 260;
        var leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        var topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition +
            ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition +
            ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
        var shareUrl = "https://twitter.com/intent/tweet?via=citibreak%20"
            + encodeURIComponent(twitterWatchText)
            + "&original_referer=" + encodeURIComponent(window.location.href)
            + "&url=" + videoPlayer.data('src')
            + "&text=" + encodeURIComponent($('meta[property="og:title"]').attr("content"));
        var newWindow = window.open(shareUrl, '', windowFeatures);
        if (window.focus) {
            newWindow.focus()
        }
    });
    $.get('/social/google?url=' + currentPageUrlEncoded,
        function (data) {
            var aggregate = $('#aggregateCount', data).html(),
                exactMatch = $('script', data).html().match('\\s*c\\s*:\\s*(\\d+)');
            $('#googleSocialCount').html(exactMatch ? exactMatch[1] + ' (' + aggregate + ')' : aggregate);
        }
    );
    $.getJSON('http://graph.facebook.com/?callback=?&id=' + currentPageUrlEncoded, function(data) {
        $('#facebookSocialCount').html(data['shares'] | '0');
    });
    $.getJSON('https://cdn.api.twitter.com/1/urls/count.json?callback=?&url=' + currentPageUrlEncoded, function(data) {
        $('#twitterSocialCount').html(data['count']);
    });

    var reportErrorButton = $('#reportErrorButton');
    var detailsReportErrorForm = $('#detailsReportErrorForm');
    var detailsReportErrorModal = $('#detailsReportErrorModal');
    var detailsReportCompleteModal = $('#detailsReportCompleteModal');
    detailsReportErrorForm.validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        onkeyup: function (element) {
            return $(element).valid();
        },
        errorPlacement: function (error, element) {
            // NOOP
        },
        submitHandler: function (form) {
            reportErrorButton.button('loading');
            $.post(detailsReportErrorForm.attr('action'), detailsReportErrorForm.serialize(), function(data) {
                detailsReportErrorForm.resetForm();
                detailsReportErrorModal.modal('hide');
                detailsReportCompleteModal.modal('show');
            });
            return false;
        }
    });
    detailsReportErrorModal.on('show.bs.modal', function (e) {
        reportErrorButton.button('reset');
    });
}

$.fn.pop = function() {
    var top = this.get(-1);
    this.splice(this.length-1,1);
    return top;
};

function initTags() {
    var tagErrorsTimeout = null;
    var tagsSelectList = $('#tagsSelectList');
    var tagErrors = $('#tagsTooMany');
    var inputs = tagsSelectList.find('input');
    tagsSelectList.find('.thumbnail').on('click', function () {
        var tagContainer = $(this).children('.tags-select-img-container');
        var tagInput = tagContainer.children('input');
        var tagSpan = tagContainer.children('.tags-select-checkbox');
        if (tagInput.is(':checked')) {
            tagSpan.removeClass('tags-select-checkbox-checked');
            tagSpan.addClass('tags-select-checkbox-unchecked');
            tagInput.prop("checked", false);
            if (tagErrorsTimeout) {
                clearTimeout(tagErrorsTimeout);
            }
            tagErrors.fadeOut(100);
        } else {
            if (inputs.filter(':checked').size() < 5) {
                tagSpan.addClass('tags-select-checkbox-checked');
                tagSpan.removeClass('tags-select-checkbox-unchecked');
                tagInput.prop("checked", true);
            } else {
                tagErrors.stop().fadeIn(100);
                if (tagErrorsTimeout) {
                    clearTimeout(tagErrorsTimeout);
                }
                tagErrorsTimeout = setTimeout(function() {
                    tagErrors.fadeOut(100);
                }, 5000)
            }
        }
    });

    // Dock the header to the top of the window when scrolled past the banner.
    // This is the default behavior.
//    $('.previous-page-button').scrollToFixed({
//        marginTop: 20
//    });
}
function initAccountGeneral() {
    var accountUpdateModal = $('#accountUpdateModal');
    var accountFormValidator = $("#accountForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: false
            },
            newPassword: {
                required: false
            },
            confirmPassword: {
                required: false,
                equalTo: "#accountNewPassword"
            }
        },
        onkeyup: function (element) {
            return $(element).valid();
        },
        success: function (label) {
            label.addClass("valid").text($.validator.messages.completed);
        },
        errorPlacement: function (error, element) {
            element.closest(".form-group").find('.error-container').append(error);
        },
        submitHandler: function (form) {
            $.post($(form).attr('action'), $(form).serialize(), function (result) {
                if (result.success == true) {
                    accountUpdateModal.modal('show');
                    setTimeout(function() {
                        accountUpdateModal.modal('hide');
                    }, 4000);
                } else {
                    $('#' + result.field + 'ErrorContainer').html('<label for="' + result.field + '" class="error">' + result.error + '</label>');
                }
                return false;
            });
            return false;
        }
    });
    $('.js-account-reload').click(function() {
        window.location.reload();
    });
}

function initAccountDelete() {
    var accountDeleteModal = $('#accountDeleteModal');
    var accountFormValidator = $("#accountForm").validate({
        rules: {
            password: {
                required: true
            }
        },
        onkeyup: function (element) {
            return $(element).valid();
        },
        success: function (label) {
            label.addClass("valid").text($.validator.messages.completed);
        },
        errorPlacement: function (error, element) {
            element.closest(".form-group").find('.error-container').append(error);
        },
        submitHandler: function (form) {
            $.post($(form).attr('action'), $(form).serialize(), function (result) {
                if (result.success == true) {
                    accountDeleteModal.modal('show');
                } else {
                    $('#' + result.field + 'ErrorContainer').html('<label for="' + result.field + '" class="error">' + result.error + '</label>');
                }
                return false;
            });
            return false;
        }
    });
    $('.js-account-reload').click(function() {
        window.location.reload();
    });
}

function initAccountProfile() {
    var accountForm = $("#accountForm");
    var accountFormValidator = accountForm.validate({
        rules: {
            name: {
                required: true
            }
        },
        onkeyup: function (element) {
            return $(element).valid();
        },
        success: function (label) {
            label.addClass("valid").text($.validator.messages.completed);
        },
        errorPlacement: function (error, element) {
            element.closest(".form-group").find('.error-container').append(error);
        },
        submitHandler: function (form) {
            accountForm.ajaxSubmit({
                dataType: 'json',
                beforeSubmit: function(arr, $form, options) {
                    var fileDataIndex = -1;

                    $.each(arr, function(index, value) {
                        if (value.name == "avatar"){
                            if (value.value.length == 0){
                                fileDataIndex = index;
                            }
                        }
                    });

                    if (fileDataIndex != -1){
                        delete arr[fileDataIndex];
                    }
                },
                success: function(result) {
                    if (result.success == true) {
                        var accountUpdatedModal = $('#accountUpdatedModal');
                        accountUpdatedModal.modal('show');
                        setTimeout(function() {
                            accountUpdatedModal.modal('hide');
                        }, 2000);
                    } else {
                        $('#' + result.field + 'ErrorContainer').html('<label for="' + result.field + '" class="error">' + result.error + '</label>');
                    }
                }
            });
            return false;
        }
    });
}
function initAvatarSystem() {
    var registerSelectedAvatar = $('#registerSelectedAvatar');
    var accountSelectAvatarInput = $('#accountSelectAvatarInput');
    var accountDefaultAvatarInput = $('#accountDefaultAvatarInput');
    $('#accountSelectAvatarButton').click(function() {
        accountSelectAvatarInput.click();
        $(this).blur();
        return false;
    });
    var accountCurrentAvatarImage = $('#accountCurrentAvatarImage');
    accountSelectAvatarInput.change(function() {
        accountDefaultAvatarInput.val('');
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                accountCurrentAvatarImage.add(registerSelectedAvatar).attr('src', e.target.result);
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
    $('.account-default-avatar').click(function() {
        var src = $(this).attr('src');
        accountCurrentAvatarImage.add(registerSelectedAvatar).attr('src', src);
        accountDefaultAvatarInput.val(src);
    });
}

function initArticles() {
    var drawArticleMap = function() {
        var latLng = getArticleLatLng();
        var articleMap = new google.maps.Map(document.getElementById("article-map-canvas"), {
            center: latLng,
            mapTypeControl: false,
            streetViewControl: false,
            zoom: 13
        });
        new google.maps.Marker({
            position: latLng,
            title: /*[[${site.name}]]*/ "Title",
            animation: false,
            map: articleMap,
            icon: "/img/red-pin.png"
        });
        return articleMap;
    };

    var articlePlayer = null;
    var articleMap = null;
    var articlePopupLoading = $('#articlePopupLoading');
    var articlePopup = $('#articlePopup');
    var articlePopupContent = articlePopup.find('.modal-content');
    articlePopup.on('shown.bs.modal', function() {
        if (articlePopupContent.find('#articleVideoPlayer').size() > 0) {
            articlePlayer = initVideo();

        }
    });
    articlePopup.on('hide.bs.modal', function() {
        if (articlePlayer) {
            if (typeof articlePlayer.pause != 'undefined') {
                articlePlayer.pause();
            } else if (typeof articlePlayer.stopVideo != 'undefined') {
                articlePlayer.stopVideo();
            }
        }
    });
    $('#homeCarousel').find('a').click(function() {
        articlePopupContent.html(articlePopupLoading);
        articlePopup.modal('show');
        $.get($(this).data('url'), function(data) {
            articlePopupContent.html(data);
            articlePopupContent.find('#articleDescriptionText').mCustomScrollbar({
                theme: "dark",
                scrollInertia: 0,
                scrollbarPosition: 'inside'
            });
            articlePopupContent.find('.js-modal-close').on('click', function () {
                $(this).closest('.modal').modal('hide');
            });
            articlePopupContent.find('#articleShowMap').on('click', function() {
                if (articlePlayer) {
                    if (typeof articlePlayer.pause != 'undefined') {
                        articlePlayer.pause();
                    } else if (typeof articlePlayer.stopVideo != 'undefined') {
                        articlePlayer.stopVideo();
                    }
                }
                if (!articleMap) {
                    articleMap = drawArticleMap();
                }
                articlePopupContent.find('#articleMedia,.jsShowWithImage').fadeOut('fast', function() {
                    articlePopupContent.find('#articleMap,.jsShowWithMap').fadeIn('fast');
                    google.maps.event.trigger(articleMap, 'resize');
                    articleMap.setCenter(getArticleLatLng());
                });
            });
            articlePopupContent.find('#articleShowImage').on('click', function() {
                articlePopupContent.find('#articleMap,.jsShowWithMap').fadeOut('fast', function() {
                    articlePopupContent.find('#articleMedia,.jsShowWithImage').fadeIn('fast', function() {
                        if (articlePlayer) {
                            if (typeof articlePlayer.play != 'undefined') {
                                articlePlayer.play();
                            } else if (typeof articlePlayer.playVideo != 'undefined') {
                                articlePlayer.playVideo();
                            }
                        }
                    });
                });
            });
        });
    });
}

function initBuzz() {
    var setHeightNeeded = true;
    var button = $('#buzzNextAdd');
    var centerSlotRefresh = function() {
        clearTimeout(centerSlotTimeout);
        var container = $('#addWrapper');
        if (setHeightNeeded) {
            container.parent().height(container.height());
            setHeightNeeded = false;
        }
        button.fadeOut('fast');
        container.fadeOut('fast', function() {
            googletag.pubads().refresh([centerSlot]);
            container.fadeIn('fast', function() {
                centerSlotTimeout = setTimeout(centerSlotRefresh, 6000);
            });
            button.fadeIn('fast');
        });
    };
    var centerSlotTimeout = setTimeout(centerSlotRefresh, 6000);
    button.click(function() {
        centerSlotRefresh();
        return false;
    });
}