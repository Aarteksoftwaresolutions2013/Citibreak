function initHomeCategories() {
    $('#homeCarousel').carouFredSel({
        direction: 'up',
        circular: false,
        infinite: false,
        items: {
            visible: 3
        },
        scroll: {
            duration: 250,
            easing: "linear"
        },
        mousewheel: {
            duration: 200,
            easing: "linear"
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
}
function initHomePopup() {
    var homeSelectDatePickerInput = $('#homeSelectDatePickerInput');
    $('.input-daterange').datepicker({
        startDate: new Date(),
        language: country,
        format: 'dd-mm-yyyy',
        autoclose: true
    });

    $('#homeSelectDatePicker').datepicker('setDate', moment(homeSelectDatePickerInput.val(), 'YYYY-MM-DD').toDate());
    $('#homeSelectDatePickerEnd').datepicker('setDate', moment(homeSelectDatePickerInput.val(), 'YYYY-MM-DD').toDate());

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
    var citiesResultTemplate = Hogan.compile([
            '<div class="row search-result-container">',
            '<div class="col-lg-12 text-left">',
            '<div class="left-arrow">›</div>',
            '<p style="white-space: normal;"><strong>{{name}}</strong>&nbsp;<span class="small">{{postalCode}}</span></p>',
            '</div>',
            '</div>']
            .join('')
    );
    homeSelectCityInput.typeahead(
        {
            minLength: 3,
            highlight: true,
            autoselect: true,
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
    )
        .on("typeahead:selected typeahead:autocompleted", function (e, datum) {
            updateHomeSelectCity(datum);
        })
        .on("change", function () {
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

            //if (!homeSelectCityLatInput.val() || !homeSelectCityLonInput.val()) {
            //    $(this).val("");
            //}
        }).on('keyup', function(e) {
            if(e.which == 13) {
                $(this).closest('form').submit();
            }
        })
    ;

    homeSelectCityInput.on("click", function () {
        ev = $.Event("keydown")
        ev.keyCode = ev.which = 40
        $(this).trigger(ev)
        return true
    });

    $('#homeSelectCityForm').find('.tt-dropdown-menu').mCustomScrollbar({
        theme: "dark",
        scrollInertia: 0,
        scrollbarPosition: 'inside'
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
    var mySelectChoices = $('#mySelectChoices');
    var mySelectButton = $('#mySelectButton');
    mySelectChoices.css("left", mySelectButton.outerWidth());
}
var SEARCH_RESULTS_MAP = null;
var SEARCH_RESULTS_MARKERS = {};
var SEARCH_RESULTS_MARKERS_ZINDEX = {};
function clearOverlays() {
    for (id in SEARCH_RESULTS_MARKERS) {
        var marker = SEARCH_RESULTS_MARKERS[id];
        console.log(marker);
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
        var marker = SEARCH_RESULTS_MARKERS[id];
        marker.setIcon('/img/blue-pin.png');
        marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
    }).on('mouseleave', function () {
        var id = $(this).data('id');
        if (!SEARCH_RESULTS_MARKERS[id]) {
            return;
        }
        var marker = SEARCH_RESULTS_MARKERS[id];
        marker.setIcon('/img/red-pin.png');
        marker.setZIndex(SEARCH_RESULTS_MARKERS_ZINDEX[id]);
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
    var currentZIndex = 0;
    children.each(function (index, item) {
        var id = $(item).data('id');
        if (SEARCH_RESULTS_MARKERS[id] == undefined) {
            var latLng = new google.maps.LatLng($(item).data('lat'), $(item).data('lng'));
            var marker = new google.maps.Marker({
                position: latLng,
                title: String($(item).data('name')),
                animation: false,
                map: SEARCH_RESULTS_MAP,
                icon: "/img/red-pin.png",
                zIndex: ++currentZIndex
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
            SEARCH_RESULTS_MARKERS[id] = marker;
            SEARCH_RESULTS_MARKERS_ZINDEX[id] = marker.getZIndex();
        }

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
    if (window.location.hash != '#back') {
        $.fn.carouFredSel.cookie.set('citibreak_results', 0);
    }
    $('#searchResultsCarousel').carouFredSel({
        direction: 'up',
        circular: false,
        infinite: false,
        cookie: 'citibreak_results',
        items: {
            visible: 2
        },
        scroll: {
            duration: 250,
            easing: "linear",
            onBefore: clearOverlays,
            onAfter: function (data) {
                drawMarkers(data.items.visible);
                ellipsis(data.items.visible);
            }
        },
        mousewheel: {
            duration: 200,
            easing: "linear"
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
    $('#favoritesResultsCarousel').carouFredSel({
        direction: 'up',
        circular: false,
        infinite: false,
        items: {
            visible: 2
        },
        scroll: {
            duration: 250,
            easing: "linear"
        },
        mousewheel: {
            duration: 200,
            easing: "linear"
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
    $('#dayOutRemoveButton').click(function() {
        var form = $('#dayOutRemoveForm');
        $.post(form.attr('action'), form.serialize(), function () {
            window.location = "/favorites/dayOut/";
        });
        return false;
    });
}
function initAgenda() {
    $('#favoritesResultsCarousel').carouFredSel({
        direction: 'up',
        circular: false,
        infinite: false,
        items: {
            visible: 2
        },
        scroll: {
            duration: 250,
            easing: "linear"
        },
        mousewheel: {
            duration: 200,
            easing: "linear"
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
}
function autoResizeLines() {
    setTimeout(function() {
        $('.auto-resize-line').each(function() {
            var height = $(this).height();
            var children = $(this).find ('span');
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
var selectedItems = [];
var searchStreamItems = {};
var historyEntries = {};
var historyEntriesPerType = {};
var dayOutAgenda = {shortUrl: "", longUrl: "", uuid: ""};
var dayOutName = '';
var venueTypes = ['CULTURAL', 'RESTAURANT', 'BAR', 'SHOPPING'];

function selectItem(id) {
    if ($.inArray(id, selectedItems) == -1) {
        $('p#selectedItem' + id).addClass('btn-selected').removeClass('btn-select-item');
        selectedItems.push(id);
    } else {
        $('p#selectedItem' + id).removeClass('btn-selected').addClass('btn-select-item');
        var index = selectedItems.indexOf(id);
        selectedItems.splice(index, 1);
    }
    if (selectedItems.length == 0) {
        $('#createDayOutPage4Button,#createDayOutPage3Button').attr('disabled', true);
    } else {
        $('#createDayOutPage4Button,#createDayOutPage3Button').removeAttr('disabled');
    }
}

function initLayout() {
    var headerPopupSearchModal = $('#headerPopupSearchModal');
    var headerPopupSearchInput = $('#headerPopupSearchInput');
    var headerPopupSearchClear = $('#headerPopupSearchClear');
    var searchPopupResultsCount = $('#searchPopupResultsCount');
    var headerSearchInput = $('#headerSearchInput');
    var searchPopupForm = $('#searchPopupForm');

    var engine = new Bloodhound({
        name: 'headerSearch',
        limit: '4',
        remote: {
            url: '/search/fuzzy?query=%QUERY',
            rateLimitBy: 'throttle',
            rateLimitWait: 300,
            filter: function (response) {
                var results = [];
                $.each(response['sites'], function (index, site) {
                    results.push(site);
                });
                searchPopupResultsCount.html(response['count']['total']);
                return results;
            }
        },
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    engine.initialize();
    headerPopupSearchModal.on('shown.bs.modal', function () {
        searchPopupResultsCount.html(0);
        headerPopupSearchInput.focus();
    }).on('hidden.bs.modal', function () {
        searchPopupResultsCount.html(0);
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
        '<div class="left-arrow">›</div>',
        '<h2 class="no-margin">{{name}}</h2>',
        '<span class="search-result-description">{{address.city}} {{#mainThemes.' + country + '}}| {{mainThemes.' + country + '}}{{/mainThemes.' + country + '}}</span>',
        '</div>',
        '</div>'
    ].join(''));
    headerPopupSearchInput.typeahead(
        {
            hint: false,
            minLength: 3,
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
            window.location.href = datum['detailsUrl'] + '?history=add';
            return false;
        })
        .on('keyup', function () {
            if ($(this).val() == '') {
                searchPopupResultsCount.html(0);
            }
        });
    headerPopupSearchInput.on('propertychange keyup input paste', function() {
        var io = $(this).val().length ? 1 : 0;
        headerPopupSearchClear.stop().fadeTo(150, io);
        if (!io) {
            searchPopupResultsCount.html(0);
        }
    });
    headerPopupSearchClear.click(function() {
        headerPopupSearchInput.typeahead('val', '');
        headerPopupSearchInput.attr('placeholder', '').focus();
        searchPopupResultsCount.html(0);
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

    var newsletterSubscribeModal = $("#newsletterSubscribeModal");
    var newsletterSubscribeForm = $("#newsletterSubscribeForm");
    var hideNewsletterSubscribeModal = function() {
        newsletterSubscribeModal.modal('hide');
        $('#subscriberEmail').val('');
        $('#newsletterErrorContainer').html('');
    };
    newsletterSubscribeForm.validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        success: function (label) {
            label.remove();
        },
        errorPlacement: function (error, element) {
            element.closest(".form-group").find('.error-container').append(error);
        },
        submitHandler: function (form) {
            newsletterSubscribeForm.ajaxSubmit({
                dataType: 'json',
                success: function (result) {
                    if (result.success == true) {
                        $('#suscriberEmailServerError').remove();
                        newsletterSubscribeModal.modal('show');
                        newsletterSubscribeModal.find('.js-modal-close').on('click', hideNewsletterSubscribeModal);
                        setTimeout(hideNewsletterSubscribeModal, 3000);
                    } else {
                        setTimeout(function() {
                            $('#newsletterErrorContainer').html(
                                '<label class="error" id="suscriberEmailServerError" for="subscriberEmail">'
                                + result.error
                                + '</label>');

                        }, 150);
                    }
                }
            });
            return false;
        }
    });

    var newsletterSubscribeButton = $('#newsletterSubscribeButton');
    newsletterSubscribeButton.click(function () {
        $('#newsletterSubscribeForm').submit();
    });
    newsletterSubscribeButton.hover(function () {
        $(this).css('cursor', 'pointer');
    }, function () {
        $(this).css('cursor', 'auto');
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
        trigger: 'hover',
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
    }).click(function() {
        $('.navbar-login-user').dropdown('toggle');
        return false;
    });

    $('#searchStreamList,#searchStreamSelectList').mCustomScrollbar({
        scrollInertia: 0,
        scrollbarPosition: 'inside'
    });

    var searchStreamOpened = false;
    var searchStream = $('#searchStream');
    var searchStreamButton = $('#searchStreamButton');
    var dayoutShareButton = $('.dayout-share-button');
    var clearSearchStreamButton = $('#clearSearchStreamButton');
    var searchActivityHint = $('#searchActivityHint');
    var createDayOutButton = $('#createDayOutButton');
    var createDayOutPage2Button = $('#createDayOutPage2Button');
    var existingDaysOut = $('#existingDaysOut');
    $('input[name=historyEntryType1]').click(function(event) {
        $('#searchStreamList').find('div[id^="searchStreamResults"]').hide();
        var type = event.target.id.slice(1);
        $('#searchStreamResults' + event.target.id).show();
        $('#clearSearchStreamType').val(type);
        if (searchStreamItems[type] == true) {
            clearSearchStreamButton.removeAttr('disabled')
        } else {
            clearSearchStreamButton.attr('disabled', true);
        }
    });
    $('input[name=historyEntryType2]').click(function(event) {
        $('#searchStreamSelectList').find('div[id^="searchStreamSelectResults"]').hide();
        $('#searchStreamSelectResults' + event.target.id).show();
    });
    var existingDaysOutTemplate = Hogan.compile([
        '<p class="existing-dayout">{{existingDayOutText}}</p>',
        '{{#dayOuts}}',
        '<div class="dayout-row">',
        '    <div class="row">',
        '        <div class="triangle"></div>',
        '        <div class="dayout-name">',
        '            {{name}}',
        '        </div>',
        '    </div>',
        '    <div class="dayout-date">',
        '        {{created}}',
        '    </div>',
        '</div>',
        '{{/dayOuts}}'
    ].join(''));
    var searchStreamResultsTemplate = Hogan.compile([
        '{{#distinctEntries}}',
        '<div class="row application-row">',
        '    <div class="row">',
        '        <a href="/{{basePath}}/{{subjectId}}/details/?history=add" class="application-url">',
        '            <div class="col-xs-3 application-image">',
        '                <div class="free-ribbon" style="width: 150px; height: 100px;">',
        '                    <img src="{{displayImageUrl}}" height="100" width="150"/>',
        '                </div>',
        '            </div>',
        '            <div class="col-xs-6 venue-details">',
        '                <div class="application-languages">{{dateFromNow}}</div>',
        '                <div class="application-info">{{name}}</div>',
        '                <div class="application-languages">{{{address}}}</div>',
        '            </div>',
        '        </a>',
        '        <p id="selectedItem{{subjectId}}" onclick="selectItem(\'{{subjectId}}\');" class="col-xs-2 btn-select-item noselect" style="display: none;">',
        '           &nbsp;',
        '        </p>',
        '    </div>',
        '    <hr class="pull-left col-xs-10"/>',
        '</div>',
        '{{/distinctEntries}}'
    ].join(''));
    var searchStreamSelectResultsTemplate = Hogan.compile([
        '{{#distinctEntries}}',
        '<div class="row application-row">',
        '    <div class="row">',
        '        <a href="#" onclick="selectItem(\'{{subjectId}}\');" class="application-url">',
        '            <div class="col-xs-3 application-image">',
        '                <div class="free-ribbon" style="width: 150px; height: 100px;">',
        '                    <img src="{{displayImageUrl}}" height="100" width="150"/>',
        '                </div>',
        '            </div>',
        '            <div class="col-xs-6 venue-details">',
        '                <div class="application-languages">{{dateFromNow}}</div>',
        '                <div class="application-info">{{name}}</div>',
        '                <div class="application-languages">{{{address}}}</div>',
        '            </div>',
        '            <p id="selectedItem{{subjectId}}" class="col-xs-2 {{selectButtonClass}} noselect">',
        '               &nbsp;',
        '            </p>',
        '        </a>',
        '    </div>',
        '    <hr class="pull-left col-xs-10"/>',
        '</div>',
        '{{/distinctEntries}}'
    ].join(''));
    var dayOutItemsListTemplate = Hogan.compile([
        '{{#dayOutItems}}',
        '<div class="row application-row">',
        '    <div class="row">',
        '        <a href="#" onclick="selectItem(\'{{subjectId}}\');" class="application-url">',
        '            <div class="col-xs-3 application-image">',
        '                <div class="free-ribbon" style="width: 150px; height: 100px;">',
        '                    <img src="{{displayImageUrl}}" height="100" width="150"/>',
        '                </div>',
        '            </div>',
        '            <div class="col-xs-5 venue-details">',
        '                <div class="application-info">{{name}}</div>',
        '                <div class="application-languages">{{{address}}}</div>',
        '            </div>',
        '            <p id="selectedItem{{subjectId}}" class="col-xs-3 btn-selected noselect">',
        '               &nbsp;',
        '            </p>',
        '        </a>',
        '    </div>',
        '    <hr class="pull-left col-xs-10"/>',
        '</div>',
        '{{/dayOutItems}}'
    ].join(''));
    function emptySearchStream() {
        searchActivityHint.html(noRecentActivityModalHintText);
        searchStreamButton.addClass('search-stream-inactive-button').off('click');
        $('#searchActivityHint').addClass('search-stream-inactive-button-hint').removeClass('icons-bar-hint-message');
    }
    function emptySearchStreamType(type) {
        var searchStreamResults = $('#searchStreamResults_' + type);
        searchStreamResults.html(
            '<div class="row"><div class="row applications-empty-image"><img src="/img/applications-empty.png"/></div>' +
            '<div class="row applications-empty-message">' + noRecentActivityText + '</div></div>');
        searchStreamItems[type] = false;
        if (!function () {
                var result = false;
                venueTypes.forEach(function (t) {
                    if (searchStreamItems[t] == true) {
                        result = true;
                    }
                });
                return result; }()) {
            emptySearchStream();
        }
    }
    function openSearchStream() {
        $.get('/history?sessionId=' + sessionId, function(data) {
            searchStream = {};
            if (!data['entries'] || data['entries'].length <= 0) {
                emptySearchStream();
                return;
            } else {
                historyEntries = {};
                data['distinctEntries'].forEach(function(item) {
                    historyEntries[item['subjectId']] = item;
                });
                $('#searchActivityHint').removeClass('search-stream-inactive-button-hint').addClass('icons-bar-hint-message');
                searchStreamButton.removeClass('search-stream-inactive-button').click(function () {
                        createDayOutPage0();
                        $('#searchStreamModal').modal('show');
                    }
                );
            }

            for (var i = data['distinctEntries'].length - 1; i >= 0 ; i--) {
                data['distinctEntries'][i]['dateTime'][1] = data['distinctEntries'][i]['dateTime'][1] - 1;
                data['distinctEntries'][i]['dateFromNow'] = moment(data['distinctEntries'][i]['dateTime']).fromNow();
            }
            venueTypes.forEach(function (type) {
                var subData = {};
                var searchStreamResults = $('#searchStreamResults_' + type);
                subData['distinctEntries'] = data['distinctEntries'].filter(function(elem) {
                    return elem.type == type;
                });
                if (!subData['distinctEntries'] || subData['distinctEntries'].length <= 0) {
                    searchStreamResults.html(
                        '<div class="row"><div class="row applications-empty-image"><img src="/img/applications-empty.png"/></div>'+
                        '<div class="row applications-empty-message">'+noRecentActivityText+'</div></div>');
                    searchStreamItems[type] = false;
                    clearSearchStreamButton.removeAttr('disabled');
                    return;
                }
                searchStreamItems[type] = true;
                clearSearchStreamButton.attr('disabled', true);
                searchStreamResults.html(searchStreamResultsTemplate.render(subData));
                historyEntriesPerType[type] = subData;
            });
        });
    }

    function openSelectDayOutItems() {
        venueTypes.forEach(function (type) {
            var subData = historyEntriesPerType[type];
            var searchStreamSelectResults = $('#searchStreamSelectResults' + type);
            if (!subData || !subData['distinctEntries'] || subData['distinctEntries'].length <= 0) {
                searchStreamSelectResults.html(
                    '<div class="row"><div class="row applications-empty-image"><img src="/img/applications-empty.png"/></div>' +
                    '<div class="row applications-empty-message">' + noRecentActivityText + '</div></div>');
                return;
            }
            for (var i = subData['distinctEntries'].length - 1; i >= 0 ; i--) {
                subData['distinctEntries'][i]['selectButtonClass'] = ($.inArray(subData['distinctEntries'][i]['subjectId'], selectedItems) == -1) ? "btn-select-item" : "btn-selected";
            }
            searchStreamSelectResults.html(searchStreamSelectResultsTemplate.render(subData));
        });
    }

    function createDayOutShowPage(page) {
        [0, 1, 2, 3, 4].forEach(function(p) {
            if (p == page) {
                var currentPage = $('#createDayOutPage' + p);
                currentPage.show();
                currentPage.find('.create-dayout-page').html(page + '/4').attr('style', 'display: ' + (page == 0 ? 'none;' : 'block;'));
            } else {
                $('#createDayOutPage' + p).hide();
            }
        });
    }

    function loadExistingDaysOut() {
        $.get('/dayout', function(data) {
            data['existingDayOutText'] = existingDayOutText;
            if ((!data['dayOuts'] || data['dayOuts'].length <= 0)) {
                existingDaysOut.html('<img src="/img/friends.jpg" width="480"/>');
                existingDaysOut.addClass('first-dayout');
                $('#firstDayOut').show();
            } else {

                for (var i = 0; i < data['dayOuts'].length; i++) {
                    data['dayOuts'][i]['created'] = new Date(data['dayOuts'][i]['created']).format('d/m/y');
                }

                existingDaysOut.mCustomScrollbar("destroy");
                existingDaysOut.html(existingDaysOutTemplate.render(data));
                $('#firstDayOut').hide();
                existingDaysOut.mCustomScrollbar({
                    scrollInertia: 0,
                    scrollbarPosition: 'inside'
                });
            }
        });
    }

    function createDayOutPage0() {
        $('.btn-select-item').hide().addClass('btn-select-item').removeClass('btn-selected');
        createDayOutShowPage(0);
        loadExistingDaysOut();
        selectedItems = [];
        $('#createDayOutPage4Button,#createDayOutPage3Button').attr('disabled', true);
    }

    function createDayOutPage1() {
        createDayOutShowPage(1);
    }

    function createDayOutPage2() {
        createDayOutShowPage(2);
        dayOutName = $('#dayOutName').val();
        openSelectDayOutItems();
    }

    function createDayOutPage3() {
        createDayOutShowPage(3);
        $('#dayOutNameConfirm').val(dayOutName);
        var dayOutItems = [];
        for (var i = 0; i < selectedItems.length; i++) {
            dayOutItems.push(historyEntries[selectedItems[i]]);
        }
        var dayOutItemsList = $('#dayOutItemsList');
        dayOutItemsList.mCustomScrollbar("destroy");
        dayOutItemsList.html(dayOutItemsListTemplate.render({dayOutItems: dayOutItems}));
        dayOutItemsList.mCustomScrollbar({
            scrollInertia: 0,
            scrollbarPosition: 'inside'
        });
        $('.btn-select-item').show();
    }

    function createDayOutPage4() {
        createDayOutShowPage(4);
        dayOutName = $('#dayOutNameConfirm').val();
        $('#dayOutNameDisplay').html(dayOutName);
        dayoutShareButton.attr("disabled", true);
        var data = {};
        data['_csrf'] = $('#createDayOutForm').serialize().split('=')[1];
        data['entries'] = [];
        for (var i = 0; i < selectedItems.length; i++) {
            ['subjectId', 'name', 'displayImageUrl', 'basePath', 'type', 'address'].forEach(function (prop) {
                data['entries[' + i + '].' + prop] = historyEntries[selectedItems[i]][prop];
            });
        }

        data['name'] = dayOutName;
        $.post('/dayout', data, function(response) {
            dayOutAgenda['shortUrl'] = response.shortUrl;
            dayOutAgenda['longUrl'] = response.longUrl;
            dayOutAgenda['uuid'] = response.uuid;
            dayoutShareButton.removeAttr("disabled");
        });
    }

    createDayOutButton.off().click(function() {
        createDayOutPage1();
    });
    createDayOutPage2Button.click(function() {
        createDayOutPage2();
    });
    $('#createDayOutPage3Button').off().click(function () {
        createDayOutPage3();
    });
    $('#createDayOutPage4Button').off().click(function() {
        createDayOutPage4();
    });

    $('#createDayOutPreviousStep1').click(function() {
        createDayOutPage0();
    });
    $('#createDayOutPreviousStep2').click(function() {
        createDayOutPage1();
    });
    $('#createDayOutPreviousStep3').click(function() {
        createDayOutPage2();
    });

    var shareMethods = {
        dayOutShareFacebook: function(agenda) {
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object: agenda['shortUrl']
                })
            }, function (response) {
            });
        },
        dayOutShareMail: function (agenda) {
            var data = {
                name: dayOutName,
                user: loggedInUser,
                venues: [],
                url: agenda['shortUrl']
            };
            selectedItems.forEach(function (id) {
                var item = historyEntries[id];
                item['type'] = venueTypeTitles[item['type']];
                item['address'] = item['address'].replace(/<\/?[^>]+(>|$)/g, " ");
                data['venues'].push(item);
            });
            var body = $("<div>").html(Hogan.compile(agendaEmailBodyTemplate).render(data)).text();

            window.location.href = "mailto:?body=" + encodeURIComponent(body) + "&subject=" + encodeURIComponent(agendaEmailSubject);
        },
        dayOutShareGoogle: function(agenda) {
            var width = 600;
            var height = 600;
            var leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
            var topPosition = (window.screen.height / 2) - ((height / 2) + 50);
            var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition +
                ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition +
                ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
            var shareUrl = "https://plus.google.com/share?url=" + encodeURIComponent(agenda['longUrl']);
            var newWindow = window.open(shareUrl, '', windowFeatures);
            if (window.focus) {
                newWindow.focus()
            }
        }
    };

    dayoutShareButton.click(function (evt) {
        shareMethods[evt.target.parentNode.id](dayOutAgenda);
    });

    $('#createDayOutInfo').hover(function() {
        $('#createDayOutHint').toggle();
    });
    $('#saveDayOutInfo').hover(function() {
        $('#saveDayOutHint').toggle();
    });
    searchStreamButton.hover(function() {
       if (!searchStreamOpened) {
           $('#searchActivityHint').toggle();
       }
    });
    clearSearchStreamButton.click(function () {
        var type = $('#clearSearchStreamType').val();
        if (type == null || type == '' || typeof type == 'undefined') {
            type = venueTypes[0];
            $('#clearSearchStreamType').val(type);
        }
        var form = $('#clearSearchStreamForm');
        $.post(form.attr('action'), form.serialize(), function (data) {
            emptySearchStreamType(type);
        });
        return false;
    });

    openSearchStream();

    var iconsBarExpand = $('#iconsBarExpand');
    var iconsBarCollapse = $('#iconsBarCollapse');
    var iconsBarSocial = $('#detailsSocial');
    var toggleCollapseExpand = function() {
        iconsBarSocial.toggle('fast');
        iconsBarCollapse.toggle();
        iconsBarExpand.toggle();
    };
    iconsBarExpand.on('click', toggleCollapseExpand);
    iconsBarCollapse.on('click', toggleCollapseExpand);

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

    $('.js-previous-page-button').click(function() {
        history.back();
        return false;
    });

    // Forgot password
    var resetPasswordPopup = $('#forgotPasswordModal');
    var resetPasswordForm = $("#resetPasswordForm");
    resetPasswordForm.submit(function() {
        resetPasswordForm.ajaxSubmit({
            dataType: 'json',
            success: function (result) {
                if (result.success == true) {
                    resetPasswordPopup.modal('hide');
                } else {
                    $('#' + result.field + 'ErrorContainer').html('<label for="' + result.field + '" class="error">' + result.error + '</label>');
                }
            }
        });
        return false;
    });
    $('#resetPasswordSubmit').click(function() {
        resetPasswordForm.submit();
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
function initVenueDetails() {

    var directionsButton = $('#directionsBtn');
    var venueLat = $('#venueDetailsLat').val();
    var venueLon = $('#venueDetailsLon').val();
    var siteLat = $('#venueDetailsSiteLat').val();
    var siteLon = $('#venueDetailsSiteLon').val();
    var latLng = new google.maps.LatLng(venueLon, venueLat);
    var siteMap = null;
    var currentLocation = '';
    directionsButton.click(function() {
        window.open('https://www.google.com/maps/dir/' + currentLocation + '/' + venueLon + ',' + venueLat, '');
    });
    if (siteLat != null) {
        currentLocation = siteLon + ',' + siteLat;
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                    currentLocation = position.coords.latitude + ',' + position.coords.longitude;
                }, function (error) {
                }
            );
        }
    }

    if (!siteMap) {
        siteMap = drawMap("venueDetailsMap", latLng);
    }

    $('#venueReviews').mCustomScrollbar({
        scrollInertia: 0,
        scrollbarPosition: 'inside'
    });
}
function initDetails() {
    var detailsTabContainer = $('#detailsInfoContainer');
    var allDetailsTab = $('.js-details-tab');
    var detailsActionPanels = $('.details-action-panel');
    var detailsAddCommentText = $('#detailsAddCommentText');
    var detailsRightPanel = $('#detailsRightPanel');
    function resizePanels(vertical) {
        var width = detailsRightPanel.width() + 30;
        var containerWidth = $('.js-details-info-comments').width();
        var buttonWidth = $('#detailsAddCommentButton').width();
        detailsActionPanels.css('width', width);
        $(detailsAddCommentText).css('width', containerWidth - buttonWidth - (vertical ? 115 : 125));
    }
    function toggleCurrentTab() {
        if ($(this).hasClass('active')) {
            return false;
        }
        allDetailsTab.removeClass('active');
        $(this).addClass('active');
        var target = $(this).data('target');
        detailsTabContainer.children().slideUp('fast');
        detailsTabContainer.children(target).slideDown('fast');
        return false;
    }
    var detailsNoComments = $('#detailsNoComments');
    var detailsDisplayAddCommentsContainer = $('#detailsDisplayAddCommentsContainer');
    var detailsCommentsContainer = $('#detailsCommentsContainer');
    var detailsDisplayAddComments = $('#detailsDisplayAddComments');
    var detailsDisplayAddCommentsButton = $('#detailsDisplayAddCommentsButton');
    var detailsAddCommentContainer = $('#detailsAddCommentContainer');
    var detailsInfoComments = $('#detailsInfoReviews');
    var detailsAddCommentButton = $('#detailsAddCommentButton');
    var detailsAddCommentCancelButton = $('#detailsAddCommentCancelButton');
    var detailsDisplayReportComment = $('#detailsDisplayReportComment');
    var detailsAddCommentForm = $('#detailsAddCommentForm');
    var detailsCommentsCount = $('#detailsCommentsCount');
    var detailsCommentsList = $('#detailsCommentsList');
    allDetailsTab.on('click', toggleCurrentTab);
    var detailsActions = $('.js-details-action-opening');
    var detailsCommentsClose = $('#detailsCommentsClose');
    var venuesResultsTemplate = Hogan.compile([
        '<div class="row applications-info-message">',detailsVenuesHint,'</div>',
        '{{#venues}}',
        '<div class="row application-row">',
        '    <a href="/venue/{{venueType}}/{{id}}/details?siteId={{siteId}}&history=add" class="application-url">',
        '        <div class="row">',
        '            <div class="col-xs-3 application-image">',
        '                {{#imageUrl}}' +
        '                <div class="free-ribbon" style="width: 150px; height: 100px;">',
        '                    <img src="{{imageUrl}}" height="100" width="150"/>',
        '                </div>',
        '                {{/imageUrl}}' +
        '                {{^imageUrl}}' +
        '                <div class="free-ribbon" style="width: 150px; height: 150px;">',
        '                    <img src="/img/{{venueTypeLowercase}}.jpg" height="150" width="150"/>',
        '                </div>',
        '                {{/imageUrl}}' +
        '            </div>',
        '            <div class="col-xs-6 venue-details">',
        '                <div class="application-info">{{name}}</div>',
        '                <div class="application-languages">{{{formattedAddress}}}</div>',
        '                <div class="venue-category">{{category}}</div>',
        '            </div>',
        '            <div class="col-xs-2">',
        '                <div class="application-languages">{{distance}} m</div>',
        '                {{#rating}}',
        '                <div class="venue-rating">',
        '                    <span>{{rating}}</span>',
        '                </div>',
        '                {{/rating}}',
        '            </div>',
        '            <div class="col-xs-1">',
        '            </div>',
        '        </div>',
        '    </a>',
        '    <hr class="pull-left col-xs-10"/>',
        '</div>',
        '{{/venues}}'
    ].join(''));
    var commentsResultsTemplate = Hogan.compile([
        '{{#reverseComments}}',
        '<div class="details-comment">',
            '<img src="{{imageUrl}}" width="44" height="44" class="img-circle" />',
            '<span class="details-comment-name">{{name}}</span>',
            '<div class="details-comment-text">',
                '<p>{{text}}</p>',
                '<span>{{formattedDate}}</span>',
                '<button type="button" class="btn btn-comment-report">' + alertText + '</button>',
            '</div>',
        '</div>',
        '{{/reverseComments}}'
    ].join(''));
    function displayNoComments() {
        detailsNoComments.find('#detailsNoCommentsButtonContainer').append(detailsDisplayAddComments);
        $('#addCommentsAnonymousMessage').addClass('details-add-first-comment');
        detailsNoComments.show().children().show();
        detailsAddCommentContainer.hide();
        detailsInfoComments.hide();
        detailsDisplayAddComments.show();
    }
    function displayComments() {
        detailsDisplayAddCommentsContainer.append(detailsDisplayAddComments);
        $('#addCommentsAnonymousMessage').removeClass('details-add-first-comment');
        detailsNoComments.hide();
        detailsAddCommentContainer.hide();
        detailsDisplayAddCommentsContainer.show();
        detailsInfoComments.show();
        detailsDisplayAddComments.show();
    }
    function loadComments() {
        $.get('/subjects/comments', {id: detailsCommentsContainer.data('site-id')}, function(data) {
            if (!data['comments'] || data['comments'].length <= 0) {
                displayNoComments();
                detailsDisplayAddCommentsButton.click(function(event) {
                    event.stopPropagation();
                    if (loggedInUser) {
                        detailsDisplayAddComments.parent().hide();
                        detailsNoComments.children().hide();
                        detailsNoComments.append(detailsAddCommentContainer);
                        detailsAddCommentContainer.show();
                        resizePanels(true);
                    }
                    return false;
                });
                detailsAddCommentCancelButton.click(function(event) {
                    event.stopPropagation();
                    displayNoComments();
                });
                return;
            } else {
                displayComments();
                detailsDisplayAddCommentsButton.click(function(event) {
                    event.stopPropagation();
                    if (loggedInUser) {
                        detailsDisplayAddComments.parent().hide();
                        $('.js-details-info-comments').append(detailsAddCommentContainer);
                        detailsAddCommentContainer.show();
                        resizePanels(false);
                    }
                    return false;
                });
                detailsAddCommentCancelButton.click(function(event) {
                    event.stopPropagation();
                    displayComments();
                });
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
            $('.btn-comment-report').click(function() {
                var contactUsModal = $('#contactUsModal');
                contactUsModal.on('show.bs.modal', function (e) {
                    $('#reportErrorSubject').val('alert');
                });
                contactUsModal.modal('show');
            });
        });
    }
    function loadVenues() {
        ['RESTAURANT', 'BAR', 'SHOPPING'].forEach(function (venueType) {
            $.get('/venue/search',
                {
                    siteId: $('#venuesModal').data('site-id'),
                    venueType: venueType
                }, function (data) {
                    if (!data['venues'] || data['venues'].length <= 0) {
                        $('#venues' + venueType).html(
                            '<div class="row">' +
                            '    <div class="row applications-empty-image">' +
                            '        <img src="/img/applications-empty.png"/>' +
                            '    </div>' +
                            '    <div class="row applications-empty-message">' +
                            detailsTicketsEmpty +
                            '    </div>' +
                            '</div>');
                    } else {
                        data['venueType'] = venueType;
                        data['venueTypeLowercase'] = venueType.toLowerCase();
                        data['siteId'] = $('#venuesModal').data('site-id');
                        var rendered = venuesResultsTemplate.render(data);
                        $('#venues' + venueType).html(rendered);
                        $('#noVenuesMessage').hide();
                        $('#venuesButton').off().removeClass('icons-bar-things-to-do-inactive')
                            .addClass('icons-bar-things-to-do').click(function () {
                                $('#venuesModal').modal('show');
                            }).hover(function() {
                                $('#venuesButtonHint').toggle();
                            });
                    }
                });
        });
    }
    function toggleAction(elem) {
        if (elem == null) elem = this;
        var openPanel = !$(elem).hasClass('details-action-panel-opened');
        detailsActions.removeClass('details-action-panel-opened');
        detailsActionPanels.fadeOut('fast');
        if (openPanel) {
            $(elem).addClass('details-action-panel-opened');
            var children = $(elem).children();
            children.fadeIn('fast');
            $('html').one('click', function() {
                detailsActions.removeClass('details-action-panel-opened');
                detailsActionPanels.fadeOut('fast');
            });
        } else {
        }
        return false;
    }
    detailsCommentsContainer.add(detailsAddCommentContainer).add(detailsAddCommentButton).click(function() {
        return false;
    });
    detailsCommentsClose.on('click', toggleAction);
    detailsActions.on('click', function() {
        $('.icons-social-hint-message').hide();
        $('#detailsShare,#detailsFavorite,#detailsRate').unbind('mouseenter mouseleave');
        toggleAction(this);
        return false;
    }).mousedown(function(event) {
            if ($(event.target).hasClass('details-action')) {
                event.preventDefault();
            }
        });
    var detailsRatingForm = $('#detailsRating');
    var detailsRatingCount = $('#detailsRatingCount');
    var detailsRatingAverage = $('#detailsRatingAverage');
    var detailsRatingVotes = $('#detailsRatingVotes');
    var detailsRatingClose = $('#detailsRatingClose');
    var detailsRatingText = $('#detailsRatingText');
    function resetStars() {
        var rating = detailsRatingCount.text();
        if (rating == -1) {
            detailsRatingForm.children('.details-rating-star').attr('src', '/img/rating-gray.png');
        } else {
            var currentRating = detailsRatingForm.children('.details-rating-star:eq(' + rating + ')');
            currentRating.prevAll(".details-rating-star").andSelf().attr('src', '/img/rating-blue.png');
            currentRating.nextAll(".details-rating-star").attr('src', '/img/rating-gray.png');
            if (rating == '') {
                detailsRatingText.fadeTo(0, 0).text('1/5');
            } else {
                detailsRatingText.text(rating + '/5');
            }
        }
    }
    detailsRatingClose.mouseenter(resetStars).click(toggleAction);
    detailsRatingForm.mouseleave(resetStars)
    .children('.details-rating-star').click(function () {
        detailsRatingForm.off();
        var rating = $(this).data('rating');
        var url = detailsRatingForm.attr('action') + '?' + detailsRatingForm.serialize()
            + '&rating=' + rating;
        $.post(url, function (result) {
            var average = result['average'];
            var votes = result['votes'];
            if (average == null) {
                average = '&nbsp;';
            }
            if (rating == 0 || votes == 0) {
                detailsRatingCount.parent().addClass('details-rating-empty')
            } else {
                detailsRatingCount.parent().removeClass('details-rating-empty')
            }
            detailsRatingCount.text(rating);
            detailsRatingAverage.html(average);
            detailsRatingVotes.text(detailsRatingVotes.data('text').replace('{0}', votes));
            detailsRatingForm.mouseleave(resetStars);
            return false;
        });
    }).mouseenter(function () {
        var rating = $(this).data('rating');
        $(this).prevAll(".details-rating-star").andSelf().attr('src', '/img/rating-blue.png');
        $(this).nextAll(".details-rating-star").attr('src', '/img/rating-gray.png');
        if (rating <= 5 && rating >= 0) {
            detailsRatingText.text(rating + '/5').fadeTo(0, 1);
        }
    });
    var detailsFavorite = $('#detailsFavorite');
    var detailsFavoriteForm = $('#detailsFavoriteForm');
    detailsFavorite.click(function() {
        if ($(this).hasClass('details-action-panel-opened')) {
            return;
        }
        detailsFavorite.addClass('details-action-panel-opened');
        var isFavorite = detailsFavorite.hasClass('details-favorite-active');
        var url = detailsFavoriteForm.attr('action') + '?' + detailsFavoriteForm.serialize()
            + '&favorite=' + (isFavorite ? 'false' : 'true');
        $.post(url, function (result) {
            if (isFavorite) {
                detailsFavorite.removeClass('details-favorite-active');
            } else {
                detailsFavorite.addClass('details-favorite-active');
            }
            detailsFavorite.removeClass('details-action-panel-opened');
            return false;
        });
    });
    resizePanels();
    $(window).resize(resizePanels);
    $('#detailsInfoAboutText,#detailsInfoInfoText,#detailsInfoEvents,#applicationsList,#ticketsList,#venuesList').mCustomScrollbar({
        scrollInertia: 0,
        scrollbarPosition: 'inside'
    });
    $('.details-actions .details-action').tooltip({
        trigger: 'hover',
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
    }).filter('.details-login-required').click(function() {
        $('.navbar-login-user').dropdown('toggle');
        return false;
    });
    $('#detailsRatingAnonymous').hover(function() {
        $('#ratingAnonymousMessage').toggle();
    });
    $('#detailsFavoriteAnonymous').hover(function() {
        $('#favoriteAnonymousMessage').toggle();
    });
    $('#noApplications').hover(function() {
        $('#noApplicationsMessage').toggle();
    });
    $('#IOS,#ticketSingle').click();
    $('#applicationsButton').click(function() {
        $('#applicationsModal').modal('show');
    }).hover(function() {
        $('#applicationsButtonHint').toggle();
    });
    $('#visitButton,#detailsPricingButton').click(function() {
        var modal = $('#ticketsModal');
        if (modal.data('tickets')) {
            modal.find('#ticketGroup').click();
        }
        modal.modal('show');
    });
    $('#visitButton').hover(function() {
        $('#visitButtonHint').toggle();
    });
    var ticketGroupLoaded = false;
    var ticketsTemplate = Hogan.compile([
        '{{#tickets}}',
            '<div class="row application-row">',
                '<a target="_blank" class="application-url" href="{{url}}">',
                    '<div class="row">',
                        '<div class="col-xs-2 application-image">',
                            '<div class="free-ribbon" style="width: 80px; height: 80px;">',
                                '<img height="80" width="80" src="{{imageUrl}}" />',
                            '</div>',
                        '</div>',
                        '<div class="col-xs-8">',
                            '<div class="application-info">{{name}}</div>',
                            '<div class="application-info">{{formattedPrice}}</div>',
                        '</div>',
                        '<div class="col-xs-2">',
                        '</div>',
                    '</div>',
                '</a>',
                '<hr class="pull-left col-xs-9">',
            '</div>',
        '{{/tickets}}'
    ].join(''));
    $('#ticketGroup').click(function() {
        if (ticketGroupLoaded) {
            return;
        }
        ticketGroupLoaded = true;
        var ticketGroupForm = $('#ticketGroupForm');
        $.get(ticketGroupForm.attr('action'), ticketGroupForm.serialize(), function(data) {
            var container = $('#ticketGroupContainer');
            container.find('#ticketLoader').hide();
            if (data.count.total > 0) {
                container.find('#ticketFound').show();
                container.append(ticketsTemplate.render(data));
            } else {
                container.find('#ticketNotFound').show();
            }
        });
    });
    var privateToursLoaded = false;
    var privateToursTemplate = Hogan.compile([
        '{{#privateTours}}',
        '<div class="row application-row">',
        '<a target="_blank" class="application-url" href="{{url}}">',
        '<div class="row">',
        '<div class="col-xs-2 application-image">',
        '<div class="free-ribbon" style="width: 80px; height: 80px;">',
        '<img height="80" width="80" src="{{displayImageUrl}}" />',
        '</div>',
        '</div>',
        '<div class="col-xs-8">',
        '<div class="application-info">{{headlineLocalized}}</div>',
        '<div class="application-info">{{formattedPrice}}<small style="padding-left:20px;">{{promoLocalized}}</small></div>',
        '<div style="color: white;">{{descriptionLocalized}}</div>',
        '<div><br />{{language}}</div>',
        '</div>',
        '<div class="col-xs-2">',
        '</div>',
        '</div>',
        '</a>',
        '<hr class="pull-left col-xs-9">',
        '</div>',
        '{{/privateTours}}'
    ].join(''));
    $('#privateTour').click(function() {
        if (privateToursLoaded) {
            return;
        }
        privateToursLoaded = true;
        var privateToursForm = $('#privateToursForm');
        $.get(privateToursForm.attr('action'), privateToursForm.serialize(), function(data) {
            var container = $('#privateTourContainer');
            container.find('#privateToursLoader').hide();
            if (data.count.total > 0) {
                container.find('#privateToursFound').show();
                for (var i = 0; i < data['privateTours'].length; i++) {
                    if (data['privateTours'][i]['description']) {
                        data['privateTours'][i]['descriptionLocalized'] = data['privateTours'][i]['description'][country]
                            || data['privateTours'][i]['description']['fr'];
                    }
                    if (data['privateTours'][i]['headline']) {
                        data['privateTours'][i]['headlineLocalized'] = data['privateTours'][i]['headline'][country]
                            || data['privateTours'][i]['headline']['fr'];
                    }
                    if (data['privateTours'][i]['promo']) {
                        data['privateTours'][i]['promoLocalized'] = data['privateTours'][i]['promo'][country]
                            || data['privateTours'][i]['promo']['fr'];
                    }
                }
                container.append(privateToursTemplate.render(data));
            } else {
                container.find('#privateToursNotFound').show();
            }
        });
    });
    $('#ticketSingle,#ticketGroup,#privateTour').click(function(event) {
        $('#ticketsList').find('.js-ticket-container').hide();
        $('#' + event.target.id + 'Container').show();
    });
    $('#noVisit').hover(function() {
        $('#noTicketsMessage').toggle();
    });
    $('#venuesButton').hover(function() {
        $('#noVenuesMessage').toggle();
    });
    $('#detailsShare').mouseenter(function(e) {
        $('#shareButtonHint').show();
    }).mouseleave(function() {
        $('#shareButtonHint').hide();
    });
    $('#detailsFavorite').mouseenter(function(e) {
        $('#favoriteButtonHint').show();
    }).mouseleave(function(e) {
        $('#favoriteButtonHint').hide();
    });
    $('#detailsRate').mouseenter(function(e) {
        $('#ratingButtonHint').show();
    }).mouseleave(function(e) {
        $('#ratingButtonHint').hide();
    });
    $('#IOS').click();
    $('input[name=applicationType]').click(function(event) {
        $('#applicationsList').find('div[id^="applications"]').hide();
        $('#applications' + event.target.id).show();
    });
    $('input[name=venueType]').click(function(event) {
        $('#venuesList').find('div[id^="venues"]').hide();
        $('#venues' + event.target.id).show();
    });
    detailsDisplayAddCommentsButton.hover(function(event) {
        if (!loggedInUser) {
            $('#addCommentsAnonymousMessage').toggle();
        }
    });
    detailsAddCommentButton.click(function(event) {
        event.stopPropagation();
        var textarea = detailsAddCommentForm.find('textarea');
        if (textarea.val() == "") {
            toggleAction();
            return false;
        }
        $.post(detailsAddCommentForm.attr('action'), detailsAddCommentForm.serialize(), function(data) {
            textarea.val("");
            loadComments();
            detailsAddCommentContainer.fadeIn('fast');
            detailsDisplayAddCommentsContainer.show();
        });
        return false;
    });
    loadComments();
    loadVenues();
    var player;
    var imageContainer = $('#imageContainer');
    var detailsPlay = $('#detailsPlay');
    var videoPlayer = $('#videoPlayer');
    var detailsImage = $('#detailsImage');
    var detailsVideo = $('#detailsVideo');
    var detailsActionsVideo = $('#detailsActionsVideo');
    var detailsImageWidth = detailsImage.width();
    var detailsImageHeight = detailsImage.height();
    setTimeout(function() {
        detailsPlay.fadeIn('fast');
    }, 500);
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
            detailsVideo.hide();
            detailsImage.fadeIn('fast');
        });
        player.addEventListener("ended", function() {
            detailsVideo.hide();
            detailsImage.fadeIn('fast');
        });
    };

    var videoUrl = videoPlayer.data('src');
    var videoId = initAndGetVideoId(videoUrl);
    detailsImage.add(detailsVideo).height(detailsImageHeight);
    detailsPlay.click(function() {
        detailsImage.hide();
        detailsVideo.fadeIn('fast', function() {
            if (player == null) {
                player = new YT.Player('videoPlayer', {
                    height: detailsImageHeight,
                    width: detailsImageWidth - 1,
                    videoId: videoId,
                    playerVars: {
                        controls: 1,
                        autohide: 1,
                        modestbranding: 0,
                        showinfo: 0,
                        autoplay: 1
                    },
                    events: {
                        'onReady': function() {
                            videoPlayer = $('#videoPlayer');
                            detailsPlay.fadeIn('fast');
                        },
                        'onStateChange': function(evt) {
                            if (evt.data == 2 || evt.data == 0) {
                                detailsVideo.hide();
                                detailsImage.fadeIn('fast');
                            }
                        }
                    }
                });
            } else {
                if (typeof player.play != 'undefined') {
                    window.setTimeout(function() {player.play();}, 500);
                } else if (typeof player.playVideo != 'undefined') {
                    player.playVideo();
                }
            }
        });
    });

    var directionsButton = $('#directionsBtn');
    var siteLat = $('#siteDetailsLat').val();
    var siteLon = $('#siteDetailsLon').val();
    var latLng = new google.maps.LatLng(siteLon, siteLat);
    var siteMap = null;
    var currentLocation = '';
    directionsButton.click(function() {
        window.open('https://www.google.com/maps/dir/' + currentLocation + '/' + siteLon + ',' + siteLat, '');
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
                currentLocation = position.coords.latitude + ',' + position.coords.longitude;
            }, function (error) {
            }
        );
    }

    $('#siteShowMap').on('click', function() {
        if (player) {
            if (typeof player.pause != 'undefined') {
                player.pause();
            } else if (typeof player.stopVideo != 'undefined') {
                player.stopVideo();
            }
        }
        if (!siteMap) {
            siteMap = drawMap("siteDetailsMap", latLng);
        }
        $('#detailsMedia').fadeOut('fast', function() {
            $('#detailsMap').fadeIn('fast');
            google.maps.event.trigger(siteMap, 'resize');
            siteMap.setCenter(latLng);
        });
    });
    $('#siteShowImage').on('click', function() {
        $('#detailsMap').fadeOut('fast', function() {
            $('#detailsMedia').fadeIn('fast', function() {
                if (player) {
                    if (typeof player.play != 'undefined') {
                        player.play();
                    } else if (typeof player.playVideo != 'undefined') {
                        player.playVideo();
                    }
                }
            });
        });
    });


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
    function updateSocialCounters() {
        $.get('/social/google?url=' + currentPageUrlEncoded,
            function (data) {
                var aggregate = $('#aggregateCount', data).html(),
                    exactMatch = $('script', data).html().match('\\s*c\\s*:\\s*(\\d+)');
                $('#googleSocialCount').html(exactMatch ? exactMatch[1] + ' (' + aggregate + ')' : aggregate);
            }
        );
        $.getJSON('http://graph.facebook.com/?callback=?&id=' + currentPageUrlEncoded, function (data) {
            $('#facebookSocialCount').html(data['shares'] | '0');
        });
        $.getJSON('https://cdn.api.twitter.com/1/urls/count.json?callback=?&url=' + currentPageUrlEncoded, function (data) {
            $('#twitterSocialCount').html(data['count']);
        });
    }

    updateSocialCounters();

    var iconsBarSocial = $('#detailsSocial');
    var iconsBarSocialButton = iconsBarSocial.find('.js-details-action-opening');
    iconsBarSocialButton.on('click', updateSocialCounters);

    var detailsClosing = $('.details-closing');
    function toggleNext() {
        window.setTimeout(function() {
            $(detailsClosing.get(currentDetailsClosing)).velocity({
                'rotateX': '90deg'
            }, 0).show().velocity({
                'rotateX': '0deg'
            }, 250).delay(10000).velocity({
                'rotateX': '-90deg'
            }, 250, function() {
                $(this).hide();
                if (currentDetailsClosing < detailsClosingSize) {
                    currentDetailsClosing++;
                    toggleNext()
                }
            });
        }, 500);
    }
    var currentDetailsClosing = 0;
    var detailsClosingSize = detailsClosing.size();
    toggleNext();

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
    var tagsSelectList = $('#tagsSelectList');
    var tagErrors = tagsSelectList.find('.tags-select-toomany');
    var inputs = tagsSelectList.find('input');
    tagsSelectList.find('.thumbnail').on('click', function () {
        var tagContainer = $(this).children('.tags-select-img-container');
        var tagInput = tagContainer.children('input');
        var tagSpan = tagContainer.children('.tags-select-checkbox');
        if (tagInput.is(':checked')) {
            tagSpan.removeClass('tags-select-checkbox-checked');
            tagSpan.addClass('tags-select-checkbox-unchecked');
            tagInput.prop("checked", false);
            tagErrors.fadeOut(100).each(function(i, item) {
                clearTimeout($(item).data('timeout'));
            });
        } else {
            if (inputs.filter(':checked').size() < 5) {
                tagSpan.addClass('tags-select-checkbox-checked');
                tagSpan.removeClass('tags-select-checkbox-unchecked');
                tagInput.prop("checked", true);
            } else {
                var tagError = tagContainer.children('.tags-select-toomany');
                tagError.css('hight', tagContainer.height() * 0.8);
                clearTimeout(tagError.data('timeout'));
                tagError.stop().fadeIn(100);
                tagError.data('timeout', setTimeout(function() {
                    tagError.fadeOut(100);
                }, 5000));
            }
        }
    });
    tagsSelectList.carouFredSel({
        direction: 'up',
        circular: false,
        infinite: false,
        items: {
            visible: 2
        },
        scroll: {
            duration: 250,
            easing: "linear"
        },
        mousewheel: {
            duration: 200,
            easing: "linear"
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

    // Dock the header to the top of the window when scrolled past the banner.
    // This is the default behavior.
    $('.previous-page-button').scrollToFixed({
        marginTop: 20
    });
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
var drawMap = function(mapElementId, latLng) {
    var articleMap = new google.maps.Map(document.getElementById(mapElementId), {
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

function initArticles() {
    var drawArticleMap = function() {
        return drawMap("article-map-canvas", getArticleLatLng());
    };

    var articlePlayer = null;
    var articleMap = null;
    var articlePopupLoading = $('#articlePopupLoading');
    var articlePopup = $('#articlePopup');
    var articlePopupContent = articlePopup.find('.modal-content');
    articlePopup.on('shown.bs.modal', function() {
        var height = $(this).find('#mainTitle').height();
        $(this).find('#creationDate')
            .css('lineHeight', height + 'px')
            .height(height);
        if (articlePopupContent.find('#articleVideoPlayer').size() > 0) {
            articlePlayer = initVideo();
        }
    });
    articlePopup.on('hide.bs.modal', function() {
        articleMap = null;
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