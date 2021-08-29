(function() {

    var elements = $("#contentContainer").find(".placeholder");
    elements.each(function() {

        var self = this;
        self.loaded = false;
        $(this).addClass('hidden');

        $(self).one("appear", function(url) {
            if (!this.loaded) {

                $(self).removeClass('hidden').addClass('rotateInUpRight');
                self.loaded = true;
            }
        });

    });

    $(window).bind("scroll", function(event) {

        if (elements != undefined && elements.length > 0) {
            elements.each(function() {

                var self = this;

                if (InViewPort(self) && !self.loaded) {
                    $(self).trigger('appear');
                }

                var temp = $.grep(elements, function(element) {
                    return !element.loaded;
                });
                elements = $(temp);

            });
        }
    });

    function InViewPort(element) {

        var uiElement = $(element);
        var offset = uiElement.offset();

        var win = $(window);
        var windowTop = win.scrollTop();

        var distY = (offset.top + uiElement.height() + 200) - windowTop - win.height();
        if (distY <= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    var site = {

        init: function() {

            for (var key in $.Text) {
                if ($.Text.hasOwnProperty(key)) {
                    var obj = $.Text[key];
                    var el = $("#" + key);
                    el.html(obj);
                }
            }
        }
    };

    $.site = site;

}(jQuery));

(function() {

    function Component(spot, area, title, message) {

        this.spot = spot;
        this.area = area;
        this.title = title || "";
        this.message = message || "";
        this.transitioning = false;
        this.isVisible = false;
    }

    function setAnimationDelay(element, delay) {

        element.style['animationDelay'] = delay;
        element.style['msAnimationDelay'] = delay;
        element.style['MozAnimationDelay'] = delay;
        element.style['WebkitAnimationDelay'] = delay;
    }

    var underTheHood = {

        firstClick: true,
        explanationText: $("#explanationText"),
        componentName: $("#componentName"),
        helpMessage: $("#helpMessage1"),
        particleSpot: $("#particleSpot"),
        groundSpot: $("#groundSpot"),
        snotSpot: $("#snotSpot"),
        strongSnotSpot: $("#strongSnotSpot"),
        canvasSpot: $("#canvasSpot"),

        particleArea: $("#particleArea"),
        groundArea: $("#groundArea"),
        snotArea: $("#snotArea"),
        strongSnotArea: $("#strongSnotArea"),
        canvasArea: $("#canvasArea"),
        components: null,
        lastComponent: undefined,
        transitioningCounter: 0,

        init: function() {

            var self = this;

            this.components = [
                new Component(this.particleSpot, this.particleArea, $.Text.particleTitle, $.Text.particleMessage),
                new Component(this.groundSpot, this.groundArea, $.Text.groundTitle, $.Text.groundMessage),
                new Component(this.snotSpot, this.snotArea, $.Text.snotTitle, $.Text.snotMessage),
                new Component(this.strongSnotSpot, this.strongSnotArea, $.Text.strongSnotTitle, $.Text.strongSnotMessage),
                new Component(this.canvasSpot, this.canvasArea, $.Text.canvasTitle, $.Text.canvasMessage)
            ];

            for (var i = 0; i < this.components.length; i++) {
                (function(component) {

                    component.spot.addClass('pulse');
                    setAnimationDelay(component.spot[0], i * 330 + 'ms');

                    component.click = function() {
                        component.spot.removeClass('pulse').fadeTo(.3, .3);
                        if (component.transitioning == true || self.transitioningCounter != 0) {
                            return true;
                        }

                        if (self.firstClick) {
                            self.transitioningCounter++;
                            $(componentName).fadeToggle("slow", function() {
                                self.transitioningCounter--;
                                self.firstClick = !self.firstClick;
                                component.click();
                            });
                        }

                        self.componentName.fadeToggle("slow");
                        self.explanationText.fadeToggle("slow");
                        component.transitioning = true;
                        component.isVisible = !component.isVisible;
                        self.transitioningCounter++;
                        if (self.lastComponent) {
                            self.lastComponent.spot.addClass('pulse').fadeTo(1, 1);
                        }

                        $(component.area).fadeToggle("slow", function() {
                            self.transitioningCounter--;
                            component.transitioning = false;
                            if (component.isVisible) {
                                self.componentName[0].innerHTML = component.title;
                                self.explanationText[0].innerHTML = component.message;
                                if (self.lastComponent != component) {
                                    if (self.lastComponent != undefined && self.lastComponent.isVisible) {
                                        self.lastComponent.click();
                                    }
                                }
                                self.lastComponent = component;
                            }
                        });

                    };

                    component.spot.click(component.click);
                }(this.components[i]));
            }

            this.groundSpot.trigger('click');
        }
    };

    $.underTheHood = underTheHood;

}(jQuery));

$(document).ready(function() {

    $.site.init();
    $.underTheHood.init();
    prettyPrint();

    $(".fancybox").fancybox({
        padding: 10,
        openEffect: 'elastic',
        openSpeed: 250,
        closeEffect: 'elastic',
        closeSpeed: 250,
        closeClick: true,

        helpers: {
            title: {
                type: 'over'
            }
        }
    });

    $("#screenshotLink1").attr("title", $.Text['screenshotLink1Text']);
    $("#screenshotLink2").attr("title", $.Text['screenshotLink2Text']);

    $('#shareStumbleupon').bind('click', function() {
        share('Stumbleupon');
    });

    $('#shareFacebook').bind('click', function() {
        share('Facebook')
    });

    $('#shareTwitter').bind('click', function() {
        share('Twitter', 'See how @IE10 & @ClarityCon created Contre Jour for the web #HTML5');
    });
});

function share(type, message) {
    meteor.tracking.track_conversion('63e3041e-d303-48f8-b0ae-c12a34ebd1de', { 'name': 'hp_9_share' });
    window._gaq.push(['_trackEvent', 'Share', type]);

    if (message) {
        window.open(meteor.sharing.href(type, {
            'title': message
        }), '_blank', 'width=580,height=400,menubar=0');
    } else {
        window.open(meteor.sharing.href(type), '_blank', 'width=580,height=400,menubar=0');
    }
}

// parse the query strings into a dictionary
var queryStrings = (function() {
    var assoc = {},
        queryString = location.search.substring(1) || '',
        keyValues = queryString.split('&'),
        i, len, kv,
        decode = function(s) {
            return decodeURIComponent(s.replace(/\+/g, " "));
        };

    for (i = 0, len = keyValues.length; i < len; i++) {
        kv = keyValues[i].split('=');
        if (kv.length > 0) {
            var key = kv[0];
            var val = kv.length > 1 ? kv[1] : '';
            assoc[decode(key)] = decode(val);
        }
    }

    return assoc;
})();

function getQueryString(key, defaultValue) {
    var qs = queryStrings[key];
    if (qs == null) {
        return (defaultValue == null) ? '' : defaultValue;
    }
    return qs;
}

(function($) {
    
    this.localizedStrings = {
    
        'en': {
    
            //under the hood section
            underTheHoodTitle: "Under the Hood",
            helpMessage: "PLAY THE GAME",
            helpMessage1: "CLICK A SPOT TO LEARN MORE",
    
            particleTitle: "Particles & Game Details",
            particleMessage: "Since the many moving particles that fill the screen are dynamic, we had to pay careful attention to rendering performance.  From a coding perspective, grass, dust and flies are sprites that need to be updated and drawn frequently to maintain the game's lively atmosphere.  Immersing the player in a detail rich environment adds surprise and delight to the experience. But, if done incorrectly, these details can end up being more of a distraction rather than adding value.  <br /> <br />To address the performance problems that came along with Contre Jour's complex environment, we kept environment particles on a separate canvas.  We also used primitive frame drop logic within the particle engine to ensure a smooth experience. In other words, batches of particles are updated every frame but only drawn occasionally.  By doing this we were able to maintain the visually detailed world of Contre Jour without impacting performance.",
    
            groundTitle: "Ground Physics",
            groundMessage: "<div id='groundFigure'></div>A defining feature of Contre Jour is how the user interacts and manipulates the surrounding world rather than manipulating the game's hero character.  In Contre Jour, a player shapes the clay-like ground with their finger, which is one of the primary ways to move the game's hero, named Petit, around the screen. <br/><br/> Coding the ground logic in JavaScript was a big challenge. Mimicking the way it moves and shapes as the user touches it as well as the way it interacts with the games hero required pages of physics soaked logic. To render Contre Jour's clay-like ground we used a modified JavaScript port of <a target='_blank' href='http://code.google.com/p/box2dweb/'>Box2D</a>, which is the same physics engine used in the iOS version. This gave us almost identical functionality for managing physics objects, creating joints, and handling collisions. <br /><br/>  The ground is made up of many distinct individual Box2D bodies, and that's what gives it the ability to be shaped. It appears so smooth when it's drawn because a <a target='_blank' href='http://www.w3schools.com/html5/canvas_quadraticcurveto.asp'> quadratic curve </a> is drawn in-between each of its sub-bodies. This gives the ground its claylike feel, but also makes rendering it very expensive.",
    
            snotTitle: "Snots",
            snotMessage: "<div id='snotPhysicsFigure'></div>The ropes (called snots) in the game are actually made up of four separate images (the head, the eye, the eyeball, and the tail) connected together by drawing at least four Bezier curves and two lines. Thes snots are created by chaining bodies together with joints in the Box2D physics engine. <br/><br/>Once the rope's bodies are created, we can ask for the location of the rope's bodies. With those locations, we start a canvas path and append to it quadratic curves based on the bodies locations. When the path is complete, we stroke it a solid black and then perform a fill operation.",
    
            strongSnotTitle: "Snot Texturing",
            strongSnotMessage: "<div id='snotFigure'></div> Drawing the ropes turned out to be one of the most complex parts of the project because there is no visually reliable way to apply a texture to geometry through the canvas API, which is commonplace in gaming languages like OpenGL. <br /><br /> Unlike other games, many of Contre Jour's game elements are drawn procedurally using the Canvas API, rather than using sprite images. For example, the static ropes which are drawn dynamically, also contain a striped pattern that we could not easily apply a texture to. To draw these ropes we needed to follow this series of steps: <ol><li>Split the rope up into a number of sections based on the rope's length.</li><li>For each section, divide it into two separate pieces - a top piece and a bottom piece.</li><li>For both the top and bottom pieces in each section, calculate a separate transform based upon the section's points and draw the appropriate half of the texture based upon those values.</li></ol>",
    
            canvasTitle: "Multiple Canvas Approach",
            canvasMessage: "<div id='canvasFigure'></div>As mentioned earlier, compositing various game elements on multiple HTML5 Canvas elements is critical to achieving good performance in complex browser-based games.  <br/><br/> By using this approach, we were able to selectively update and draw different parts of the screen at different rates.  Updating and drawing the ground isn't cheap, so we needed to be selective about when and how we rendered it. Each piece of ground is rendered on its own HTML5 canvas, separate from other game elements. This was necessary because it enabled us to disconnect changes to the ground from other elements in the game by tracking each ground section and detecting whether or not the user had changed it. <br/> <br/> Each time the user drags or moves the ground, we flag the affected ground piece, and only that ground's specific canvas is updated and redrawn. Had we left the ground to a single HTML5 canvas, the performance would have been unacceptable due to the constant rendering of the ground. You can learn more about how to achieve good performance with complex scenes in this <a href='http://www.html5rocks.com/en/tutorials/canvas/performance/'>Canvas Performance</a> article. <p class='tip' style='margin-left:0px;'>Tip: Not all game elements need to be updated and drawn at the same frequency, and by spreading components of the game across multiple canvases, you can more easily manage drawing a large number of elements at various frequencies during your game loop. Don't go crazy though, you'll see a performance impact if you layer too many canvases on top of each other.</p>",
    
            //site text
            intro1: "\"Contre Jour\" is a video game that is \"blurring the lines between interactive art and games\". Made popular on iOS, and created by <a href='http://chillingo.com/features/mokus-maksym-hryniv-genius-behind-contre-jour-spea/'>Maksym (Max) Hryniv</a>, Contre Jour is known world-wide for its innovative gameplay, charming art style, and captivating soundtrack. With the debut of Internet Explorer 10, Microsoft was looking for an opportunity to demonstrate the updated JavaScript engine and advanced multi-touch features they had packed into their new browser.",
            intro2: "Contre Jour's snappy touch controls,  unique gameplay, and intensive multimedia requirements presented just the challenge Microsoft was looking for. Teaming up with Max and custom development shop <a href='http://www.claritycon.com/'>Clarity Consulting</a>, Internet Explorer has brought Contre Jour to the browser using only HTML5 and JavaScript. Completed over six months, bringing Contre Jour to the web pushed the boundaries of what even we thought was possible - proving that HTML5 is ready for the prime time as a viable platform for casual gaming on the web. The following technical tear down provides rich insight into the challenges faced and solutions achieved in bringing Petit to life in the browser. We Hope you enjoy it.",
            overviewTitle: "Overview",
            overviewText1: "The goal of the project was to show how <a target='_blank' href='http://windows.microsoft.com/en-US/windows-8/internet-explorer'>Internet Explorer 10</a> was shrinking the gap between browser based games and native games by bringing Contre Jour to HTML5. We set a goal from the start that we would do this without sacrificing any of Contre Jour's depth. We knew there were going to be challenges, and large ones at that.  Contre Jour is massive, from both a code and media perspective. It boasts over 80,000 lines of Objective-C code, hundreds of image assets, and even more configuration files. <br /><br /> The biggest challenge by far was the conversion of the Objective-C code to JavaScript. The Objective-C code was heavily object oriented and JavaScript's native support for concepts like <a href='http://en.wikipedia.org/wiki/Encapsulation_(object-oriented_programming)' target='_blank'>encapsulation</a>, <a href='http://en.wikipedia.org/wiki/Polymorphism_in_object-oriented_programming' target='_blank'>polymorphism</a>, and <a href='http://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)' target='_blank'>inheritance</a>, is sparse at best. On top of that, differences between the two languages made a direct line-by-line port out of the question.  We went through the Objective-C code in detail, evaluated each component, determining how it related to other components, and devised a way to implement each one faithfully in JavaScript.",
            overviewText2: "From the beginning, as always with game development, performance was a must.  We were concerned that tracking and moving the many elements across the screen, including the environment, would potentially tax the browser.  HTML5 makes drawing simple, but we needed to stay cognizant of the fact that drawing was going to be our most expensive operation with regards to performance. Take a look at the 'Under the Hood' section below to see some of the performance tricks we used.",
    
            techTitle: "More HTML5 Tech",
            techTitle2: "Objective-C to Javascript",
            techText1: "One of our key challenges early on was migrating the deep object hierarchy of Contre Jour from the original iOS code into JavaScript.  To help with this we leaned on <a href='http://ejohn.org/blog/simple-javascript-inheritance/' target='_blank'>John Resig's \"Simple JavaScript Inheritance\" pattern</a> in several places where we needed inheritance. <br/> <br/>This allowed us to use a lot of code from Contre Jour's Open-C architecture, more than we anticipated.  Components in the game that shared common base behaviors, such as the particle systems, were easier to implement because we had an \"inheritance\" hierarchy that allowed us to avoid writing everything from the ground up each time.  Without a pattern like this, it would have been very difficult, if not impossible, to bring the game to HTML5.  We would have ended up having to re-write most of the game. Thankfully, using Simple JavaScript Inheritance pattern saved us a lot of time and resources.",
    
            css3Title: "CSS3",
            css3Text1: "<a href='http://www.w3schools.com/css3/css3_animations.asp' target='_blank'>CSS animations</a> and <a href='http://www.w3schools.com/css3/css3_transitions.asp' target='_blank' > transitions</a> played a big part in the development of the menus and non-gameplay elements of the game. Most of these CSS transitions occur during screen transitions or game events, such as showing/hiding the pause menu, transitioning between levels, or transitioning between a level and the level picker.  In browsers like Internet Explorer 10, every pixel on the screen is hardware accelerated. What does that mean? It means that without any extra code you have the power to create high fidelity, high performant effects. This helped us offload some of the rendering work from the already abused canvas to the DOM and CSS layout engine. ",
            css3Text2: "We also used <a href='http://ie.microsoft.com/testdrive/HTML5/CSS3MediaQueries/' target='_blank'>CSS3 Media Queries</a> for scaling the site to support multiple screen resolutions.  CSS3 media queries allow developers to attach a condition to affect the scope to which the style applies.  For example, we used a media query to apply a scale transform to our outer DIV container to scale down the site for smaller screens.",
            css3Text3: "<b>Tip</b>: Scaling using media queries freed us from the burden of creating and supporting multiple sizes of images.  This is an important optimization - maintaining multiple sets of images would have caused additional pain since we had hundreds of images to manage already.",
    
            multiTouchTitle: "Multi-Touch",
            multiTouchText1: "One of the few areas in the game where our code branches in different browsers is in the implementation of multi-touch support.  Implementing multi-touch was one of the easiest parts of development, thanks to Internet Explorer 10's built-in support for pointer event listeners. The great news is that they just work.  From a developer's perspective this was great, because it allowed us to focus head's down on the more challenging parts of the project. Here is an example of code that has the event listeners hooked up across browsers:",
            multiTouchText2: "From a coding perspective, we spent some time writing a main touch module that wrapped the browser specific touch support.  The module tracks input events, regardless of the browser platform, and bubbles them up to our game engine for processing. In addition, game elements are able to \"subscribe\" to a given instance of a touch or pointer to receive update notifications through its lifecycle. This made it easy for elements like the ground in the game to respond to touch across browser platforms.",
    
            downloadTitle1: "Are You A Developer?",
            helpMessage2: "DOWNLOAD HTML5 Game Pack Here",
            downloadText1: "If you are a web developer interested in building games on the web at all, we've put together <br/> a <a href='downloads/HTML5GameKit.zip'>starter framework</a> that you can use right away to start building HTML5 games.",
            downloadText2: "The sample uses the same pattern we used for creating the game loop in Contre Jour and will help get you started writing HTML5 games. It includes a simple pattern to create a game loop, a starter game object, and code to draw to the canvas, all set up and ready to go.  The code is well documented and will walk you through the steps needed to create a basic game. You can also check out some additional developer resources here:",
            downloadText3: "<a href='https://github.com/InternetExplorer' target='_blank'>Internet Explorer GitHub repository</a> - For intermediate to advanced users. Our GitHub repository compiles much of the great work we've done over the past couple months, from building game with <a href='http://www.atari.com/arcade' target='_blank'>Atari<a/> and <a href='http://www.cuttherope.ie/' target='_blank'>Cut The Rope</a>, to developing <a href='http://www.justafriend.ie/' target='_blank'>interactive music videos with Jasmine Villegas.</a>",
    
            conclusionTitle1: "Where Do We Go From Here?",
            conclusionText1: "The fact that we were able to bring Contre Jour to the web has proved some things, the least of which is that the line between HTML5 browser gaming and native platform games is blurring. While native games still provide an edge over browser games with regards to richness, the opportunity of reach that comes with the browser is appealing. As technologies like Windows 8 and Internet Explorer 10 continue to push forward, the future for HTML5 gaming continues to get brighter.  As developers, we believe it's up to us to reset people's expectations of what is possible on the web.  We hope Contre Jour inspires the gaming community to push the limits and explore what's possible. What do you think is possible?",
    
            screenshotLink1Text: "Some game elements such as menus used DOM elements and CSS animations for hardware accelerated performance.This helped offload some of the rendering work from the HTML5 Canvas to the DOM & CSS layout engine.",
            screenshotLink2Text: "Some game elements such as menus used DOM elements and CSS animations for hardware accelerated performance.This helped offload some of the rendering work from the HTML5 Canvas to the DOM & CSS layout engine."
        },
    
        'ru': {
    
            //under the hood section
            underTheHoodTitle: "Устройство игры",
            helpMessage: "Играть по правилам",
            helpMessage1: "ЩЕЛКНИТЕ ТОЧКУ, ЧТОБЫ УЗНАТЬ БОЛЬШЕ",
    
            particleTitle: "Частицы и описание игры",
            particleMessage: "Поскольку множество двигающихся частиц, заполняющих экран, являются динамическими, мы должны были уделить много внимания скорости визуализации.  С точки зрения кода трава, пыль и мухи являются спрайтами, которые необходимо часто обновлять и рисовать для поддержки правдоподобной атмосферы игры.  Погружение игрока в детализированную среду делают игру захватывающей и полной неожиданностей. Но при неправильном использовании эти детали могут больше отвлекать, чем приносить пользы.  <br /> <br />Для решения проблем производительности, вытекающих из сложной среды Contre Jour, мы сохранили частицы среды на разных элементах Canvas.  Мы также использовали примитивную логику пропуска кадра в модуле частиц для плавного отображения. Другими словами, партии частиц обновляются каждый кадр, но рисуются гораздо реже.  Таким образом мы смогли сохранить детализированной мир Contre Jour, не ухудшив производительность.",
    
            groundTitle: "Визуализация земли",
            groundMessage: "<div id='groundFigure'></div>Основополагающим компонентом Contre Jour является не управление героем игры, а то, как пользователь взаимодействует с окружающим миром.  В Contre Jour игрок пальцами лепит из земли, напоминающей глину, различные формы, что является одним из основных способов передвижения героя игры по имени Petite. <br/><br/> Портирование логики земли в JavaScript было сложной задачей. Для имитации ее перемещения и изменения формы, когда пользователь ее касается, а также способа взаимодействия земли с героем игры требовалось множество страниц сложной физической логики. Для визуализации глиняной земли Contre Jour мы использовали модифицированный порт физического модуля <a target='_blank' href='http://code.google.com/p/box2dweb/'>Box2D</a> для JavaScript, который используется в версии для iOS. Это предоставило нам почти идентичные функции для управления физическими объектами, создания соединений и обработки столкновений. <br /><br/>  Земля состоит из множества отдельных тел Box2D, и это позволяет определять ее форму. Она кажется такой гладкой после отображения, потому что <a target='_blank' href='http://www.w3schools.com/html5/canvas_quadraticcurveto.asp'>квадратичная кривая</a> рисуется между каждыми составляющими телами. Из-за этого земля похожа на глину, но при этом такая визуализация является очень ресурсоемкой.",
    
            snotTitle: "Тянучки",
            snotMessage: "<div id='snotPhysicsFigure'></div>Веревки (которые в игре называются тянучками) на самом деле состоят из четырех отдельных изображений (головы, глаза, глазного яблока и хвоста), соединенных за счет рисования как минимум четырех кривых Безье и двух линий. Тянучки создаются за счет объединения тел с помощью соединений в физическом модуле Box2D. <br/><br/>После создания тел веревок мы можем запросить их положение. С помощью расположения мы создаем путь Canvas и добавляем его к квадратичным кривым на основе расположения тел. После завершения пути мы обводили его контур черным цветом и выполняли операцию заливки.",
    
            strongSnotTitle: "Текстуры тянучек",
            strongSnotMessage: "<div id='snotFigure'></div> Рисование веревок стало одной из самых сложных частей портирования, так как нет визуально надежного способа применения текстуры к геометрии через API-интерфейс элемента Canvas, что является обычным для таких игровых языков, как OpenGL. <br /><br /> В отличие от других игр, многие элементы Contre Jour рисуются процедурно с помощью API-интерфейса элемента Canvas, а не с помощью спрайтов. Например, статические веревки, отображаемые динамически, также содержат полосатый шаблон, к которому было непросто применить текстуру. Для рисования этих веревок необходимо было выполнить следующую последовательность действий. <ol><li>Разбить веревку на ряд разделов на основе длины веревки.</li><li>Для каждого раздела разбить его на две отдельные части: верхнюю и нижнюю.</li><li>Для обеих частей в каждом разделе вычислить собственное преобразование на основе точек раздела и нарисовать соответствующую половину текстуры на основе этих значений.</li></ol>",
    
            canvasTitle: "Подход с использованием нескольких элементов Canvas",
            canvasMessage: "<div id='canvasFigure'></div>Как было указано ранее, составные игровые элементы на нескольких элементах Canvas HTML5 очень важны для обеспечения хорошей производительности в сложных браузерных играх.  <br/><br/> Используя этот подход, мы смогли выборочно обновлять и рисовать разные части на экране с различной частотой.  Обновление и отрисовка земли отнимает немало ресурсов, поэтому мы должны были выборочно подходить к тому, когда и как ее отображать. Каждый участок земли визуализируется на собственном элементе Canvas HTML5 отдельно от других игровых элементов. Это необходимо, так как позволяет нам отсоединить изменения земли от других элементов в игре за счет отслеживания каждого раздела земли и определения того, был ли он изменен пользователем, или нет. <br/> <br/> Каждый раз, когда пользователь перетаскивает или перемещает землю, мы отмечаем затронутую часть, при этом обновляется и перерисовывается только элемент Canvas этой части земли. Если бы мы оставили землю на одном элементе Canvas HTML5, производительность была бы неприемлемо низкой из-за постоянной визуализации земли. Вы можете узнать больше об обеспечении хорошей производительности со сложными сценами в статье <a href='http://www.html5rocks.com/en/tutorials/canvas/performance/'>Производительность элемента Canvas</a>. <p class='tip' style='margin-left:0px;'>Подсказка. Не все игровые элементы необходимо обновлять и рисовать с одной частотой. За счет распределения компонентов игры по различным элементам Canvas вы можете упростить управление визуализацией большого числа элементов с разной частотой во время игрового цикла. Но важно не переусердствовать — если расположить слишком много элементов Canvas поверх друг друга, производительность может ухудшиться.</p>",
    
            //site text
            intro1: "Contre Jour — это игра, которая “стирает границы между интерактивным искусством и играми”. Ставшая популярной на устройствах с iOS и созданная <a href='http://chillingo.com/features/mokus-maksym-hryniv-genius-behind-contre-jour-spea/'>Максимом Грынивом (Max Hryniv)</a>, Contre Jour является всемирно известной игрой, отличающейся инновационным геймплеем, очаровательной стилистикой и захватывающим саундтреком. После выхода Internet Explorer 10 корпорация Майкрософт искала способ продемонстрировать обновленный модуль JavaScript и расширенные функции мультисенсорного управления, доступные в новом браузере.",
            intro2: "Сенсорные элементы управления, уникальный геймплей и интенсивные мультимедийные требования Contre Jour предоставили Майкрософт как раз то, что они искали. Объединившись с Максимом и студией веб-разработки <a href='http://www.claritycon.com/'>Clarity Consulting</a>, группа разработчиков Internet Explorer портировали Contre Jour в новый браузер, используя только HTML5 и JavaScript. Импорт Contre Jour в веб-браузер, занявший шесть месяцев, изменил границы того, что даже мы считали возможным, и доказал, что технология HTML5 готова к полноценному использованию в качестве надежной платформы для казуальных игр в Интернете. Далее представлен технический обзор с подробным описанием трудностей и решений, которые возникли при переносе героя Petite в браузер. Надеемся, что вам понравится.",
            overviewTitle: "Обзор",
            overviewText1: "Целью проекта было показать, как <a target='_blank' href='http://windows.microsoft.com/en-US/windows-8/internet-explorer'>Internet Explorer 10</a> сокращал расстояние между браузерными и автономными играми за счет портирования Contre Jour в HTML5. Мы с самого начала поставили цель, что сделаем это, не жертвуя никакими аспектами Contre Jour. Мы знали, что у нас могут возникнуть значительные трудности.  Contre Jour — это сложный проект, как с точки зрения кода, так и с точки зрения мультимедиа. Эта игра состоит из 80 000 строк кода на языке Objective-C, сотен изображений и еще большего числа файлов конфигурации. <br /><br /> Самой трудной задачей было преобразование кода Objective-C в код JavaScript. Код Objective-C был объектно ориентированным, а встроенная поддержка JavaScript таких концепций, как <a href='http://en.wikipedia.org/wiki/Encapsulation_(object-oriented_programming)' target='_blank'>инкапсуляция</a>, <a href='http://en.wikipedia.org/wiki/Polymorphism_in_object-oriented_programming' target='_blank'>полиморфизм</a> и <a href='http://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)' target='_blank'>наследование</a>, в лучшем случае скудна. Кроме того, отличия двух языков сделали невозможным прямое построчное портирование проекта.  Мы тщательно просмотрели код Objective-C, оценили каждый компонент, определили, как он связан с другими компонентами, и придумали способ реализации каждого из них в JavaScript.",
            overviewText2: "С самого начала, как это принято в разработке игр, высокая производительность была одной из главных целей.  Мы беспокоились о том, что отслеживание и перемещение многих элементов на экране, в том числе окружающей среды, может значительно ухудшить скорость работы браузера.  HTML5 упрощает рисование, но нам нужно было помнить о том, что рисование будет самой дорогостоящей операцией по отношению к производительности. Прочитайте раздел “Устройство игры” ниже, чтобы узнать о некоторых приемах повышения производительности, которые мы использовали.",
    
            techTitle: "Дополнительные технические сведения о HTML5",
            techTitle2: "Из Objective-C в Javascript",
            techText1: "Одной из главных задач на ранней стадии было портирование глубокой иерархии объектов Contre Jour из исходного кода для iOS в JavaScript.  Чтобы упростить эту операцию, мы использовали <a href='http://ejohn.org/blog/simple-javascript-inheritance/' target='_blank'>шаблон “Простое наследование в JavaScript” Джона Ресига (John Resig)</a> в нескольких местах, где нам требовалось наследование. <br/> <br/>Так мы смогли использовать гораздо больше кода из архитектуры Open-C исходной игры Contre Jour, чем ожидали.  Компоненты игры, такие как системы частиц с одинаковым базовым поведением, было легче реализовать, так как у нас была иерархия “наследования”, с помощью которой мы смогли избежать написания всего кода с нуля.  Без подобного шаблона портировать игру в HTML было бы очень сложно, если не невозможно.  Нам пришлось бы переписывать всю игру заново. К счастью, шаблон “Простое наследование в JavaScript” сэкономил нам много времени и ресурсов.",
    
            css3Title: "CSS3",
            css3Text1: "<a href='http://www.w3schools.com/css3/css3_animations.asp' target='_blank'>CSS-анимации</a> и <a href='http://www.w3schools.com/css3/css3_transitions.asp' target='_blank' > переходы</a> сыграли большую роль в разработке меню и неигровых элементов игры. Большинство из этих CSS-переходов используются при переходах между экранами или игровыми событиями, такими как отображение или скрытие меню паузы, переход между уровнями или уровнем и средством выбора уровней.  В таких браузерах, как Internet Explorer 10, каждый пиксель на экране использует аппаратное ускорение. Что это значит? Это означает, что без какого-либо дополнительного кода вы можете создавать качественные эффекты. Это помогло нам уменьшить нагрузку, связанную с визуализацией, с уже загруженного элемента Canvas и передать ее модулю разметки DOM и CSS. ",
            css3Text2: "Мы также использовали <a href='http://ie.microsoft.com/testdrive/HTML5/CSS3MediaQueries/' target='_blank'>запросы мультимедиа CSS3</a> для масштабирования сайта и поддержки нескольких разрешений экрана.  Запросы мультимедиа CSS3 позволяют разработчикам присоединять условие, определяющее область действия стиля.  Например, мы использовали запрос мультимедиа для применения преобразования масштаба к внешнему контейнеру DIV для масштабирования сайта для экранов меньшего размера.",
            css3Text3: "<b>Подсказка</b>. Масштабирование с помощью запросов мультимедиа освободило нас от необходимости создания и поддержки изображений разного размера.  Это важная оптимизация, так как необходимость применения множества наборов изображений вызвала бы дополнительные затруднения, так как нам и так уже приходилось работать с сотнями изображений.",
    
            multiTouchTitle: "Мультисенсорное управление",
            multiTouchText1: "Одной из областей игры, в которой мы использовали код, связанный с браузером, была реализация поддержки мультисенсорного управления.  Это стало одним из самых простых этапов разработки благодаря встроенной поддержке прослушивателей событий касания в Internet Explorer 10. Прекрасная новость состоит в том, что они работают.  С точки зрения разработчика это было замечательно, так как позволило нам сконцентрироваться на более трудных частях проекта. Вот пример кода с использованием прослушивателей событий касания.",
            multiTouchText2: "С точки зрения кода мы потратили какое-то время на написание основного модуля сенсорного управления, который объединял поддержку касаний в браузере и обработку событий касания.  Этот модуль отслеживает события касания независимо от платформы браузера и передает их в наш игровой модуль для обработки. Кроме того, игровые элементы могут “подписываться” на заданный экземпляр касаний, чтобы получать уведомления в течение жизненного цикла события (касание, перемещение и конечное касание). Это упростило реализацию реагирования на события касания для таких элементов, как земля, в различных платформах браузеров.",
    
            downloadTitle1: "Вы разработчик?",
            helpMessage2: "СКАЧАЙТЕ пакет Html5 Game Pack здесь",
            downloadText1: "Если вы веб-разработчик и заинтересованы в создании игр в Интернете, то вам будет полезна <br/> <a href='downloads/HTML5GameKit.zip'>платформа для начинающих</a>, которую можно использовать для быстрого создания HTML5-игр.",
            downloadText2: "В этом примере используется тот же шаблон, что применялся для создания игрового цикла в Contre Jour. Он поможет вам приступить к написанию HTML5-игр. Пример содержит простой шаблон для игрового цикла, начальный игровой объект и код для рисования элемента Canvas, готовые к использованию.  Код хорошо документирован и позволит вам понять все этапы для создания простой игры. Вы также можете получить дополнительные ресурсы для разработчиков здесь:",
            downloadText3: "<a href='https://github.com/InternetExplorer'>Репозиторий Internet Explorer GitHub</a> — для пользователей с большим опытом. Наш репозиторий GitHub содержит много работ, выполненных за последние несколько месяцев — от создания игры с помощью <a href='http://www.atari.com/arcade' target='_blank'>Atari<a/> и <a href='http://www.cuttherope.ie/' target='_blank'>Cut The Rope</a> до разработки <a href='http://www.justafriend.ie/' target='_blank'>интерактивных музыкальных видео с Жасмин Виллегас.</a>",
    
            conclusionTitle1: "Дальнейшие действия",
            conclusionText1: "То, что мы смогли перенести Contre Jour в браузер, доказало несколько фактов, наименее ценным из которых является то, что граница между HTML5-играми в браузере и автономными играми размывается. Хотя автономные игры все еще опережают браузерные игры по функциональности, возможности привлечения аудитории браузерных игр очень привлекательны. По мере развития таких технологий, как Windows 8 и Internet Explorer 10, будущее HTML5-игр выглядит оптимистичным.  Как разработчики, мы считаем, что должны были оправдать ожидания других, связанные с возможностями браузеров.  Мы надеемся, что Contre Jour вдохновит сообщество разработчиков игр и позволит раздвинуть границы возможного. А как вы думаете, что возможно?",
    
            screenshotLink1Text: "В некоторых элементах игры, таких как меню, используются DOM-элементы и CSS-анимация для аппаратного ускорения. Это позволяет переложить некоторую нагрузку по визуализации с элемента Canvas (HTML5) на модуль DOM и CSS.",
            screenshotLink2Text: "В некоторых элементах игры, таких как меню, используются DOM-элементы и CSS-анимация для аппаратного ускорения. Это позволяет переложить некоторую нагрузку по визуализации с элемента Canvas (HTML5) на модуль DOM и CSS."
        },
    
        'pt': {
    
            //under the hood section
            underTheHoodTitle: "Por Trás da Tela",
            helpMessage: "JOGAR",
            helpMessage1: "CLIQUE NUM PONTO PARA OBTER MAIS INFORMAÇÕES",
    
            particleTitle: "Partículas e Detalhes do Jogo",
            particleMessage: "Uma vez que muitas das partículas móveis que ocupam o telas são dinâmicas, foi necessário dar especial atenção ao desempenho da composição.  Do ponto de vista da codificação, a erva, o pó e os elementos voadores são sprites (pequenos elementos gráficos) que têm de ser atualizados e desenhados frequentemente para manter a atmosfera do jogo animada.  Mergulhar o jogador num ambiente cheio de detalhes confere elementos de surpresa e encanto à experiência. No entanto, se não for bem feito, estes detalhes poderão tornar-se mais um fator de distração do que acrescentar valor.  <br /> <br />Para lidar com os problemas de desempenho resultantes do ambiente complexo do Contre Jour, mantivemos as partículas do ambiente numa tela separada.  Também recorremos à lógica de ignorar fotogramas primitivos na engine de partículas para assegurar uma experiência uniforme. Por outras palavras, são atualizados lotes de partículas em cada fotograma, mas só são desenhados ocasionalmente.  Desta forma, é possível manter o mundo visualmente detalhado do Contre Jour sem causar qualquer impacto no desempenho.",
    
            groundTitle: "Física Básica",
            groundMessage: "<div id='groundFigure'></div>Uma característica fundamental do Contre Jour é a forma como o jogador interage e manipula o mundo envolvente, em vez de manipular o herói do jogo.  No Contre Jour, o jogador dá forma ao chão moldável com o dedo, que é uma das principais formas de mover pela tela o herói do jogo, chamado Petit.<br/><br/> A migração da lógica base para JavaScript constituiu um enorme desafio. Imitar os movimentos e a adoção de formas à medida que o jogador lhe toca, bem como a interação com o herói do jogo, exigiu muitas páginas de lógica baseada na física. Para compor o chão semelhante a argila do Contre Jour, recorremos a uma migração de JavaScript modificada do <a target='_blank' href='http://code.google.com/p/box2dweb/'>Box2D</a>, o mesmo engine de física utilizado na versão para iOS. Isto permitiu uma funcionalidade praticamente igual para gerir objetos físicos, criar junções e gerir colisões. <br /><br/>  O chão é composto por vários corpos Box2D individuais distintos, sendo esta a característica que lhe confere a capacidade de atribuição de formas. Tem uma superfície totalmente uniforme quando é desenhado, porque é desenhada uma <a target='_blank' href='http://www.w3schools.com/html5/canvas_quadraticcurveto.asp'>curva quadrática</a> entre cada um dos respetivos subcorpos. Isto confere ao chão a funcionalidade de argila, mas também torna a sua composição muito exigente.",
    
            snotTitle: "Snots",
            snotMessage: "<div id='snotPhysicsFigure'></div>As cordas (denominadas snots) no jogo são, na realidade, constituídas por quatro imagens separadas (a cabeça, o olho, o globo ocular e a cauda) interligadas pelo desenho de, pelo menos, quatro curvas de Bezier e duas linhas. Os snots são criados através do encadeamento dos corpos com junções no engine de física do Box2D. <br/><br/>Uma vez criados os corpos da corda, podemos solicitar a localização dos corpos da corda. Com essas localizações, podemos iniciar um caminho da tela e acrescentá-lo às curvas quadráticas com base nas localizações dos corpos. Quando o caminho estiver concluído, é desenhado o traço a preto contínuo e, em seguida, é efetuada uma operação de preenchimento.",
    
            strongSnotTitle: "Textura do Snot",
            strongSnotMessage: "<div id='snotFigure'></div> O desenho das cordas revelou-se uma das partes mais complexas da migração por não existir qualquer forma visualmente fiável de aplicar textura a formas geométricas através da API da tela, que é um lugar comum nas linguagens de jogos como o OpenGL. <br /><br /> Ao contrário de outros jogos, muitos dos elementos do jogo do Contre Jour são desenhados através de processos com a API da tela, em vez de recorrer a sprites. Por exemplo, as cordas estáticas, que são desenhadas de forma dinâmica, também contêm um padrão às listas ao qual não era fácil aplicar uma textura. Para desenhar estas cordas, precisávamos seguir uma série de passos: <ol><li>Dividir a corda em várias secções, com base no comprimento da corda.</li><li>Para cada secção, dividi-la em duas partes separadas - uma parte superior e outra parte inferior.</li><li>Para as partes superior e inferior em cada secção, calcular uma transformação separada com base nos pontos da secção e desenhar a metade adequada da textura com base nesses valores.</li></ol>",
    
            canvasTitle: "Abordagem de Telas Múltiplas",
            canvasMessage: "<div id='canvasFigure'></div>Tal como mencionado anteriormente, a composição dos vários elementos do jogo em múltiplos elementos da Tela HTML5 é fundamental para obter um bom desempenho em jogos complexos baseados no browser.  <br/><br/> Esta abordagem permite atualizar e desenhar seletivamente diferentes partes do tela a diferentes velocidades.  A atualização e desenho do chão não são feitos sem esforço, pelo que é necessário ser seletivo relativamente a quando e como deverá ser feita a sua composição. Cada elemento do chão é composto na respetiva tela HTML5, em separado dos outros elementos do jogo. Era necessário proceder desta forma, uma vez que nos permitia dissociar as alterações ao chão dos outros elementos no jogo, rastreando cada secção do chão e detetando se o utilizador a tinha ou não alterado. <br/> <br/> Sempre que o utilizador arrasta ou move o chão, sinalizamos o elemento do chão afetado e só essa tela específica do chão é atualizada e redesenhada. Se o chão tivesse uma única tela HTML5, o desempenho seria inaceitável devido à permanente composição do chão. Poderá obter mais informações sobre como obter um bom desempenho em cenas complexas no artigo <a href='http://www.html5rocks.com/en/tutorials/canvas/performance/'>Desempenho da Tela</a>. <p class='tip' style='margin-left:0px;'>Sugestão: Nem todos os elementos do jogo têm de ser atualizados e desenhados com a mesma frequência e, ao distribuir componentes do jogo por múltiplas telas, poderá gerir mais facilmente o desenho num número elevado de elementos com várias frequências durante o ciclo do jogo. Mas não se entusiasme, poderá verificar um impacto no desempenho se sobrepuser demasiadas telas.</p>",
    
            //site text
            intro1: "O \"Contre Jour\" é um videogame que vem \"mesclar a arte interativa e os jogos\". Tendo ganho popularidade no iOS, e sido criado pela <a href='http://chillingo.com/features/mokus-maksym-hryniv-genius-behind-contre-jour-spea/'>Maksym (Max) Hryniv</a>, o Contre Jour é conhecido globalmente por ter uma forma de jogar inovadora, um estilo artístico atraente e uma trilha sonora cativante. Com o lançamento do Internet Explorer 10, a Microsoft procurava uma oportunidade para fazer uma demonstração do engine JavaScript atualizado e das funcionalidades multitouch existentes no novo browser.",
            intro2: "Os rápidos controles touch do Contre Jour, a forma de jogar única e os exigentes requisitos de multimídia compunham o desafio que a Microsoft procurava. Juntando-se ao Max e à empresa de desenvolvimento Web <a href='http://www.claritycon.com/'>Clarity Consulting</a>, o Internet Explorer fez a migração do Contre Jour para o browser utilizando apenas HTML5 e JavaScript. Concluída em 6 meses, a migração do Contre Jour para a Web estabeleceu as novas fronteiras daquilo que se pensava ser possível – provar que o HTML5 está pronto para dar as cartas como plataforma viável para jogos casuais na Web. Em seguida, é apresentada uma descrição técnica com conhecimentos aprofundados importantes sobre os desafios encontrados e as soluções alcançadas para dar vida ao personagem Petit no browser. Esperamos que você aproveite.",
            overviewTitle: "Descrição geral",
            overviewText1: "O projeto tinha como objetivo mostrar como o <a target='_blank' href='http://windows.microsoft.com/pt-PT/windows-8/internet-explorer'>Internet Explorer 10</a> diminuía a diferença entre os jogos baseados no browser e os jogos nativos através da migração do Contre Jour para HTML5. Estabelecemos como objetivo desde o início conseguir fazê-lo sem sacrificar a intensidade do Contre Jour. Sabíamos que iríamos nos deparar com vários desafios, alguns deles bastante complexos.  Do ponto de vista do código e da multimídia envolvidos, o Contre Jour é muito extenso. Inclui mais de 80.000 linhas de código Objective-C, centenas de elementos de imagens e ainda mais arquivos de configuração. <br /><br /> O maior desafio até agora foi a conversão do código Objective-C em JavaScript. O código Objective-C era muito orientado para objetos e o suporte nativo do JavaScript de conceitos como <a href='http://en.wikipedia.org/wiki/Encapsulation_(object-oriented_programming)' target='_blank'>encapsulamento</a>, <a href='http://en.wikipedia.org/wiki/Polymorphism_in_object-oriented_programming' target='_blank'>polimorfismo</a> e <a href='http://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)' target='_blank'>herança</a> é, na melhor das hipóteses, escasso. Além disso, as diferenças entre as duas linguagens tornou impossível uma migração direta linha a linha.  Analisamos o código Objective-C detalhadamente, avaliamos cada componente, determinando a sua relação com os outros componentes, e elaboramos uma forma de implementar fielmente cada um em JavaScript.",
            overviewText2: "Desde o início, assim como acontece no desenvolvimento de jogos, o desempenho era a prioridade.  Estávamos preocupados com o fato de o rastreio e a movimentação de vários elementos pela tela, incluindo o ambiente, poderem, potencialmente, sobrecarregar o browser.  O HTML5 simplifica o desenho, mas tínhamos de ter consciência de que o desenho seria a operação mais exigente no que diz respeito ao desempenho. Consulte a seção \"Por Trás da Tela\" a seguir para ver alguns dos truques utilizados para manter o desempenho.",
    
            techTitle: "Mais Tecnologia HTML5",
            techTitle2: "Objective-C para Javascript",
            techText1: "Um dos nossos principais desafios iniciais era a migração da vasta hierarquia de objetos do Contre Jour do código iOS original para JavaScript.  Para ajudar nesta tarefa, recorremos ao <a href='http://ejohn.org/blog/simple-javascript-inheritance/' target='_blank'>padrão \"Simple JavaScript Inheritance\" (Herança JavaScript Simples) de John Resig</a> em vários locais onde precisávamos utilizar a herança. <br/> <br/>Isto nos permitiu utilizar uma grande quantidade de código da arquitetura Open-C do Contre Jour, mais do que inicialmente prevíamos.  Os componentes do jogo que tinham comportamentos base comuns, como os sistemas de partículas, eram mais fáceis de implementar, uma vez que tínhamos uma hierarquia de \"herança\" que nos permitiu não precisar escrever sempre todo o conteúdo de raíz.  Sem um padrão destes, teria sido muito difícil, se não impossível, migrar o jogo para HTML.  Teríamos de reescrever a maioria do jogo. Felizmente,o recurso ao padrão Simple JavaScript Inheritance poupou muito tempo e recursos.",
    
            css3Title: "CSS3",
            css3Text1: "As <a href='http://www.w3schools.com/css3/css3_animations.asp' target='_blank'>animações CSS</a> e as <a href='http://www.w3schools.com/css3/css3_transitions.asp' target='_blank' >transições</a> representaram uma parte importante no desenvolvimento dos menus e nos elementos não diretamente relacionados com a atividade do jogo. A maioria destas transições CSS ocorre durante as transições de tela ou os eventos do jogo, como, por exemplo, mostrar/ocultar o menu de pausa, alternar entre níveis ou entre um nível e o seletor de níveis.  Nos browsers como o Internet Explorer 10, cada pixel na tela beneficia da aceleração por hardware. O que significa isto? Significa que, sem qualquer código extra, é possível criar efeitos de alta-fidelidade e elevado desempenho. Isto ajudou a diminuir parte do trabalho de composição de tela, já sobrecarregado, e a passá-lo para o engine do esquema CSS e DOM. ",
            css3Text2: "Também recorremos a <a href='http://ie.microsoft.com/testdrive/HTML5/CSS3MediaQueries/' target='_blank'>técnicas de CSS3 Media Queries</a> para dimensionar o site para suportar várias resoluções de tela.  As consultas de multimídia CSS3 permitem aos programadores acrescentar uma condição para afetar o âmbito ao qual o estilo se aplica.  Por exemplo, utilizamos uma consulta de multimídia para aplicar uma transformação de escala ao nosso contentor DIV externo para reduzir o site para telas menores.",
            css3Text3: "<b>Sugestão</b>: O dimensionamento através de consultas de multimídia evitou o peso de ter de criar e suportar vários tamanhos de imagem.  Esta é uma otimização importante, pois a manutenção de vários conjuntos de imagens representaria muito trabalho extra, uma vez que já tínhamos de gerir centenas de imagens.",
    
            multiTouchTitle: "Multitouch",
            multiTouchText1: "Uma das poucas áreas no jogo onde utilizamos código específico do browser foi na implementação do suporte para multitouch.  A implementação do multitouch era uma das partes mais fáceis do desenvolvimento, graças ao suporte integrado de serviços Event Listener do Internet Explorer 10. E eles realmente funcionam!  Do ponto de vista do programador, isto é muito positivo, porque permite focar nas partes mais desafiadoras do projeto. Eis um exemplo de código com os serviços de escuta de eventos de touch associados:",
            multiTouchText2: "Do ponto de vista da codificação, passamos algum tempo escrevendo um módulo touch principal que encapsulou num wrapper o suporte de touch específico do browser e o processamento de eventos de toque.  O módulo rastreia os eventos de toque, independentemente da plataforma do browser e os apresenta ao engine do jogo para processamento. Além disso, os elementos do jogo podem \"subscrever\" determinada instância de um toque para receberem notificações através do ciclo de vida de comandos touch inicial, de movimentação e final. Isto facilitou a resposta por parte dos elementos, tal como o chão do jogo, aos comandos touch em diferentes plataformas de browser.",
    
            downloadTitle1: "Você é um desenvolvedor?",
            helpMessage2: "Baixe o pacote do jogo em HTML5 aqui",
            downloadText1: "Se você for um desenvolvedor interessado na compilação de jogos Web, preparamos<br/>uma <a href='downloads/HTML5GameKit.zip'>estrutura inicial</a> que poderá utilizar imediatamente para começar a compilar jogos em HTML5.",
            downloadText2: "O exemplo utiliza o mesmo padrão utilizado para criar o ciclo do jogo no Contre Jour e ajudará a começar a compilar jogos em HTML5. Inclui um padrão simples para criar um ciclo de jogo, um objeto de jogo inicial e código para desenhar na tela, tudo preparado e pronto para usar.  O código está bem documentado e vamos guiá-lo através dos passos necessários para criar um jogo básico. Também poderá consultar alguns recursos adicionais para programadores aqui:",
            downloadText3: "<a href='https://github.com/InternetExplorer'>Repositório GitHub para Internet Explorer</a> - Para desenvolvedores intermediários e avançados. O nosso repositório no GitHub agrega uma grande parte do excelente trabalho feito nos últimos dois meses, desde a compilação do jogo com o <a href='http://www.atari.com/arcade' target='_blank'>Atari<a/> e o <a href='http://www.cuttherope.ie/' target='_blank'>Cut The Rope</a>, ao desenvolvimento de <a href='http://www.justafriend.ie/' target='_blank'>vídeos musicais interativos com Jasmine Villegas.</a>",
    
            conclusionTitle1: "E o que vem pela frente?",
            conclusionText1: "O fato de termos conseguido trazer o Contre Jour para Web provou algumas coisas; no mínimo, que a linha que separa os jogos para browser em HTML5 e os jogos para plataformas nativas é cada vez mais tênue. Enquanto os jogos nativos continuam a demonstrar vantagens sobre os jogos para browser em termos de excelência, a oportunidade de alcance proporcionada atualmente pelo browser é muito tentadora. À medida que tecnologias como o Windows 8 e o Internet Explorer 10 continuam a proporcionar avanços, o futuro dos jogos em HTML5 é cada vez mais brilhante.  Como programadores, nos consideramos responsáveis pela redefinição das expectativas das pessoas quanto ao que é possível fazer na Web.  Esperamos que o Contre Jour inspire a comunidade dos jogos a ultrapassar os limites e a explorar as possibilidades que se apresentam. O que você acha que é possível?",
    
            screenshotLink1Text: "Alguns elementos do jogo, como menus, utilizavam elementos DOM e animações CSS para um desempenho mais rápido do hardware. Isto ajudou a descarregar algum do trabalho de composição da tela HTML5 para o engine de esquema DOM e CSS.",
            screenshotLink2Text: "Alguns elementos do jogo, como menus, utilizavam elementos DOM e animações CSS para um desempenho mais rápido do hardware. Isto ajudou a descarregar algum do trabalho de composição da tela HTML5 para o engine de esquema DOM e CSS."
        },
    
        'fr': {
    
            //under the hood section
            underTheHoodTitle: "« Sous le capot »",
            helpMessage: "JOUER AU JEU",
            helpMessage1: "CLIQUEZ SUR UN SUJET POUR EN SAVOIR PLUS",
    
            particleTitle: "Particules et détails du jeu",
            particleMessage: "Les nombreuses particules mobiles qui remplissent l'écran étant dynamiques, il était nécessaire de prêter une attention particulière aux performances de rendu.  Du point de vue du codage, l'herbe, la poussière et les mouches sont des sprites qui doivent être mis à jour et rafraîchis fréquemment, pour conserver l'atmosphère animée du jeu.  Immergé dans un environnement offrant une grande richesse de détails, le joueur éprouve un sentiment de plaisir et de surprise. Toutefois, s'ils sont imparfaits, ces détails risquent de distraire le joueur plutôt que de constituer une valeur ajoutée.  <br /> <br />Pour résoudre les problèmes de performances relatifs à l'environnement complexe de Contre Jour, nous avons conservé les particules d'environnement dans une couche séparée.  Nous avons également utilisé une logique frame drop primitive, au sein du moteur de particules, pour garantir la fluidité du jeu. En d'autres termes, les paquets de particules sont mis à jour à chaque frame, mais rafraîchis occasionnellement.  Ceci nous a permis d'offrir au joueur le monde visuellement très détaillé de Contre Jour, sans altérer les performances.",
    
            groundTitle: "Principes physiques du sol",
            groundMessage: "<div id='groundFigure'></div>L'une des caractéristiques de Contre Jour est la manière dont l'utilisateur interagit avec le monde environnant et le manipule, plutôt que d'agir sur le personnage principal lui-même.  Dans Contre Jour, le joueur met en forme le sol, comme s'il s'agissait d'argile, avec ses doigts. C'est principalement comme cela qu'il pourra déplacer dans l'écran l'héroïne du jeu, baptisée Petite. <br/><br/> Porter la logique du sol dans JavaScript a été un véritable défi. Imiter la façon dont il bouge et prend forme lorsque l'utilisateur le touche, ainsi que son interaction avec l'héroïne du jeu, a nécessité de nombreuses pages de code logique associé à des principes physiques. Pour effectuer le rendu du sol argileux de Contre Jour, nous avons utilisé un portage JavaScript de <a target='_blank' href='http://code.google.com/p/box2dweb/'>Box2D</a>, le moteur physique utilisé dans la version iOS. Nous avons ainsi obtenu une fonctionnalité identique pour la gestion des objets physiques, la création des joints et la gestion des collisions. <br /><br/>  Le sol est composé de plusieurs corps Box2D individuels distincts ; c'est ce qui lui donne sa plasticité. Son apparence si souple est due à l'intégration d'une <a target='_blank' href='http://www.w3schools.com/html5/canvas_quadraticcurveto.asp'> courbe quadratique </a> entre chacun des corps individuels. Cela lui donne cette apparence argileuse, mais augmente énormément le coût de rendu.",
    
            snotTitle: "Pendules",
            snotMessage: "<div id='snotPhysicsFigure'></div>Les cordes utilisées dans le jeu (« snots » en anglais) sont en réalité composées de quatre images distinctes (la tête, l'œil, le globe oculaire et la queue), reliées les unes aux autres par au minimum quatre courbes de Bézier et deux lignes. Pour créer ces cordes, le moteur physique Box2D a été utilisé pour chaîner plusieurs corps, avec des joints. <br/><br/>Une fois les corps de la corde créés, nous pouvons demander leur emplacement. À l'aide de ces emplacement, nous démarrons un chemin de couche et lui ajoutons des courbes quadratiques basées sur l'emplacement des corps. Lorsque le chemin est terminé, nous lui appliquons comme couleur un noir plein et commençons l'opération de remplissage.",
    
            strongSnotTitle: "Texture des cordes",
            strongSnotMessage: "<div id='snotFigure'></div> Dessiner les cordes s'est avéré être l'une des étapes les plus compliquées du portage, car il n'existe aucune méthode visuellement fiable pour appliquer une texture sur un élément géométrique via l'API Canvas, qui est courante dans les langages de jeu tels qu'OpenGL. <br /><br /> Contrairement aux autres jeux, nombre d'éléments de jeu de Contre Jour sont dessinés de manière procédurale, à l'aide de l'API Canvas, plutôt qu'avec des images de sprite. Par exemple, les cordes statiques qui sont dessinées de manière dynamique contiennent également un motif rayé, sur lequel il est difficile d'appliquer une texture. Pour dessiner ces cordes, nous avons dû observer la procédure suivante : <ol><li>Diviser la corde en un certain nombre de sections, suivant sa longueur.</li><li>Diviser chaque section en deux parties distinctes : une partie supérieure et une partie inférieure.</li><li>Pour chaque partie de chaque section, calculer une transformation séparée sur la base des points de la section, puis dessiner la moitié de texture appropriée en se basant sur ces valeurs.</li></ol>",
    
            canvasTitle: "Approche multi-couche",
            canvasMessage: "<div id='canvasFigure'></div>Comme nous l'avons expliqué précédemment, répartir les divers éléments du jeu sur plusieurs couches HTML5 Canvas est essentiel pour obtenir de bonnes performances dans les jeux par navigateur complexes.  <br/><br/> En adoptant cette approche, nous avons pu mettre à jour et rafraîchir sélectivement les différentes parties de l'écran, à des fréquences différentes.  Mettre à jour et rafraîchir (redessiner) le sol est une opération coûteuse, nous devions donc être très précis sur le moment et la manière d'effectuer le rendu. Chaque élément du sol est rendu sur sa propre couche HTML5 Canvas, indépendamment des autres éléments du jeu. Ceci était nécessaire et nous a permis de dissocier les changements apportés au sol des autres éléments du jeu, en effectuant le suivi de chaque section de sol et en détectant si l'utilisateur l'avait modifiée ou non. <br/> <br/> À chaque fois que l'utilisateur agit sur le sol (le tire ou le déplace), nous identifions la portion affectée et seule la couche associée à cette portion spécifique est mise à jour et rafraîchie. Si l'ensemble du sol avait été intégré à une seule couche HTML5 Canvas, les performances auraient été insuffisantes en raison du besoin de rendu de sol constant. Si vous souhaitez savoir comment améliorer les performances d'une scène complexe, consultez l'article <a href='http://www.html5rocks.com/en/tutorials/canvas/performance/'>Performances de couches (Canvas)</a>. <p class='tip' style='margin-left:0px;'>Astuce : Il n'est pas nécessaire de mettre à jour et de rafraîchir tous les éléments de jeu aussi fréquemment ; en répartissant les différents composants sur des couches multiples, vous pouvez gérer plus facilement le rafraîchissement d'un grand nombre d'éléments, à la fréquence de votre choix, durant votre boucle de jeu. Toutefois, ne vous emballez pas ! Les performances se dégraderont également si vous créez un trop grand nombre de couches les unes sur les autres.</p>",
    
            //site text
            intro1: "« Contre Jour » est un jeu vidéo qui « efface les frontières entre l'art interactif et le jeu ». Sorti tout d'abord sous iOS, où il a rencontré le succès, et créé par <a href='http://chillingo.com/features/mokus-maksym-hryniv-genius-behind-contre-jour-spea/'>Maksym (Max) Hryniv</a>, Contre Jour est réputé au niveau mondial pour son gameplay novateur, son style graphique délicat et sa bande son captivante. Avec la sortie d'Internet Explorer 10, Microsoft cherchait une occasion de faire la démonstration du moteur JavaScript amélioré et des fonctionnalités tactiles multipoint avancées proposés avec la nouvelle mouture du célèbre navigateur.",
            intro2: "Les commandes tactiles punchy de Contre Jour, son gameplay unique et ses exigences multimédia intensives constituaient tout à fait le défi que souhaitait relever Microsoft. S'associant à Max et à la structure de développement Web <a href='http://www.claritycon.com/'>Clarity Consulting</a>, l'équipe Internet Explorer a porté Contre Jour sur le navigateur uniquement à l'aide de HTML5 et JavaScript. Réalisé en six mois, le portage de Contre Jour sur le Web a repoussé les frontières du possible, prouvant que la technologie HTML5 était prête à faire le grand saut en tant que plate-forme viable pour les jeux Web occasionnels. Vous trouverez ci-dessous plus de détails sur les défis techniques qu'ont dû résoudre les équipes de travail pour donner vie à Petite sur le navigateur vedette. Nous espérons que vous l'apprécierez.",
            overviewTitle: "Présentation",
            overviewText1: "L'objectif du projet était de démontrer qu'<a target='_blank' href='http://windows.microsoft.com/en-US/windows-8/internet-explorer'>Internet Explorer 10</a> permettait de combler le fossé séparant les jeux par navigateur et les jeux natifs, en portant Contre Jour sous HTML5. Le but, dès le départ, était de ne rien sacrifier de la complexité du monde de Contre Jour. Nous savions que des obstacles se dresseraient sur notre route, et qu'ils seraient imposants !  Contre Jour est un véritable mastodonte, aussi bien du point de vue code que du point de vue média. Il représente plus de 80 000 lignes de code Objective-C, des centaines de ressources d'image et encore plus de fichiers de configuration. <br /><br /> Le principal défi, et de loin, était la conversion du code Objective-C en JavaScript. En effet, le code Objective-C est largement orienté objet et la prise en charge native de JavaScript pour des concepts tels que <a href='http://en.wikipedia.org/wiki/Encapsulation_(object-oriented_programming)' target='_blank'>l'encapsulation</a>, <a href='http://en.wikipedia.org/wiki/Polymorphism_in_object-oriented_programming' target='_blank'>le polymorphisme</a> et <a href='http://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)' target='_blank'>l'héritage</a> est très faible. En outre, les différences entre les deux langages rendaient impossible tout portage direct ligne par ligne.  Nous avons étudié le code Objective-C en détail, évalué chaque composant afin de déterminer sa relation avec les autres, puis imaginé un moyen de mettre en œuvre chacun de ces composants dans JavaScript, de manière fidèle à l'original.",
            overviewText2: "Depuis le début, et comme toujours dans le développement de jeux vidéo, les performances sont au cœur du problème.  Nous craignions que le suivi et le déplacement des nombreux éléments au sein de l'écran, et notamment l'environnement, ne soient trop lourds pour le navigateur.  HTML5 permet un dessin rapide (rafraîchissement), mais nous devions bien garder à l'esprit que le dessin est l'opération la plus coûteuse en termes de performances. Alors venez faire un tour « Sous le capot », dans la section ci-dessous, pour découvrir comment nous avons su résoudre ces problèmes de performances.",
    
            techTitle: "Autres technos HTML5",
            techTitle2: "Objective-C vers JavaScript",
            techText1: "L'un des principaux défis que nous avions à relever était de porter la hiérarchie complexe et approfondie d'objets de Contre Jour, depuis le code iOS original vers JavaScript.  Pour nous aider dans cette tâche, nous avons fait appel à <a href='http://ejohn.org/blog/simple-javascript-inheritance/' target='_blank'>la méthode d'héritage JavaScript simple de John Resig</a>, à tous les endroits où il était nécessaire d'utiliser des éléments hérités. <br/> <br/>Ceci nous a permis de récupérer une grande partie du code de l'architecture Open-C de Contre Jour, davantage que ce que nous avions imaginé.  Les composants de jeu tels que les systèmes de particules, qui partageaient les mêmes comportements de base, ont été faciles à mettre en œuvre, car nous disposions d'une hiérarchie « d'héritage » qui nous évitait d'avoir à tout réécrire systématiquement.  Sans ce genre de méthode, il aurait été difficile, voire impossible, de porter le jeu sous HTML.  Nous aurions fini par réécrire la majeure partie du jeu. Heureusement, cette méthode d'héritage JavaScript simple nous a fait gagner beaucoup de temps et de ressources.",
    
            css3Title: "CSS3",
            css3Text1: "Les <a href='http://www.w3schools.com/css3/css3_animations.asp' target='_blank'>animations CSS</a> et les <a href='http://www.w3schools.com/css3/css3_transitions.asp' target='_blank' > transitions</a> ont joué un rôle clé dans le développement des menus et des éléments hors gameplay. La plupart de ces transitions CSS ont lieu durant les transitions d'écran ou les événements de jeu, par exemple afficher/masquer le menu de pause, les transitions entre les niveaux ou entre un niveau et le sélecteur de niveaux.  Dans les navigateurs tels qu'Internet Explorer 10, chaque pixel à l'écran fait l'objet d'une accélération matérielle. Qu'est-ce que cela signifie ? Cela signifie qu'il est possible, sans code supplémentaire, d'obtenir la puissance nécessaire pour créer des effets haute fidélité et hautes performances. Ceci nous a aidé à décharger les couches déjà saturées d'une partie du travail de rendu, en le dérivant vers le moteur d'affichage CSS et DOM. ",
            css3Text2: "Nous avons également fait appel à des <a href='http://ie.microsoft.com/testdrive/HTML5/CSS3MediaQueries/' target='_blank'>requêtes de média CSS3 (Media Queries)</a> pour mettre à l'échelle le site, afin qu'il prenne en charge différentes résolutions d'écran.  Les requêtes de média CSS3 permettent aux développeurs d'associer une condition qui affecte la portée d'application du style.  Par exemple, nous avons utilisé une requête de média pour appliquer une transformation d'échelle à un conteneur DIV extérieur, afin d'adapter le site pour les écrans de petit format.",
            css3Text3: "<b>Astuce </b>: La mise à l'échelle par requêtes de média nous a évité d'avoir à créer et à prendre en charge plusieurs formats d'image.  Ceci est une optimisation importante, car la prise en charge de formats d'image multiples aurait représenté une charge non négligeable, venant s'ajouter aux centaines d'images déjà gérées.",
    
            multiTouchTitle: "Fonctionnalité tactile multipoint",
            multiTouchText1: "L'un des rares éléments du jeu pour lequel nous avons utilisé du code spécifique navigateur a été l'implémentation de la fonctionnalité tactile multipoint.  Cela a été l'une des tâches les plus faciles du processus de développement, grâce à la prise en charge intégrée d'Internet Explorer 10 pour les détecteurs d'événements tactiles. Et cela fonctionne parfaitement, nous l'avons testé !  Du point de vue du développeur, cela nous a été d'une grande aide, car nous avons ainsi pu nous concentrer sur les éléments plus délicats et complexes du projet. Voici un exemple de code que les détecteurs d'événements tactiles ont signalé :",
            multiTouchText2: "Du point de vue du code, nous avons passé un certain temps à écrire un module tactile principal englobant la prise en charge de la fonction tactile spécifique au navigateur et la gestion des événements tactiles.  Ce module permet le suivi des événements tactiles, quelle que soit la plate-forme de navigateur, et les regroupe pour les envoyer à notre moteur de jeu aux fins de traitement. En outre, les éléments de jeu peuvent « s'abonner » à une instance tactile donnée, afin de recevoir les notifications tout au long du cycle de vie des événements tactiles de fin, de début et de déplacement. Ceci permet aux éléments tels que le sol de répondre plus facilement aux événements tactiles, sur les différentes plates-formes de navigateur.",
    
            downloadTitle1: "Vous êtes développeur ?",
            helpMessage2: "TÉLÉCHARGEZ le pack jeu Html5 ici",
            downloadText1: "Si vous êtes développeur Web et êtes intéressé par la conception de jeux Web, nous avons mis au point <br/> un <a href='downloads/HTML5GameKit.zip'>module de démarrage</a> que vous pouvez utiliser dès aujourd'hui pour créer des jeux en HTML5.",
            downloadText2: "Cette version de démonstration utilise le même schéma que celui utilisé pour créer la boucle de jeu dans Contre Jour et vous aidera à débuter dans la conception de jeux sous HTML5. Elle comprend un schéma simple permettant de créer une boucle de jeu, un objet de jeu de démarrage et le code nécessaire pour dessiner la couche, dans un format préconfiguré et prêt à l'emploi.  Le code est bien documenté et vous guidera tout au long des étapes nécessaires pour créer un jeu simple. Vous pouvez également consulter d'autres ressources développeur via les liens ci-dessous :",
            downloadText3: "<a href='https://github.com/InternetExplorer'>Référentiel Internet Explorer GitHub</a> - Pour les utilisateurs intermédiaires à avancés. Notre référentiel GitHub compile une grande partie du travail que nous avons accompli ces derniers mois, de la création du jeu avec <a href='http://www.atari.com/arcade' target='_blank'>Atari<a/> et <a href='http://www.cuttherope.ie/' target='_blank'>Cut The Rope</a>, au développement <a href='http://www.justafriend.ie/' target='_blank'>de vidéos musicales interactives avec Jasmine Villegas.</a>",
            //   	    downloadText4 : "<a href='#'>Microsoft Developer Network</a> - For web developers of all levels, check out the Microsoft Developer Network site for Internet Explorer where you can learn everything you need to know about building for next generation browsers, getting your site touch-ready, and more!",
    
            conclusionTitle1: "Et maintenant ?",
            conclusionText1: "Le fait que nous ayons réussi à porter Contre Jour sur le Web a prouvé un certain nombre de choses, la moindre étant que la frontière entre les jeux par navigateur HTML5 et les jeux sur plate-forme native est de plus en plus floue. Alors que les jeux natifs ont toujours l'avantage sur les jeux par navigateur en ce qui concerne leur richesse et leur complexité, la facilité d'accès des seconds est attractive. À mesure que les technologies telles que Windows 8 et Internet Explorer 10 continuent de s'améliorer, l'avenir des jeux HTML5 s'éclaire de jour en jour.  En tant que développeurs, nous croyons fermement que c'est à nous de faire comprendre au public qu'ils peuvent en attendre beaucoup plus des jeux sur Internet.  Nous espérons que Contre Jour inspirera la communauté des gamers et l'incitera à repousser ses limites pour explorer d'autres possibilités. Et vous, quelle est votre limite à l'impossible ?",
    
            screenshotLink1Text: "Certains éléments du jeu, tels que des menus, utilisaient des éléments DOM et des animations CSS pour accélérer les performances matérielles. Ceci a permis de décharger les couches HTML5 d&apos;une partie du travail de rendu, en le dérivant vers le moteur d&apos;affichage CSS et DOM.",
            screenshotLink2Text: "Certains éléments du jeu, tels que des menus, utilisaient des éléments DOM et des animations CSS pour accélérer les performances matérielles. Ceci a permis de décharger les couches HTML5 d&apos;une partie du travail de rendu, en le dérivant vers le moteur d&apos;affichage CSS et DOM."
        },
    
        'es': {
    
            //under the hood section
            underTheHoodTitle: "Bajo la capucha",
            helpMessage: "JUGAR EL JUEGO",
            helpMessage1: "HAZ CLIC EN UN PUNTO PARA SABER MÁS",
    
            particleTitle: "Partículas y detalles del juego",
            particleMessage: "Dado que la multitud de partículas móviles que llenan la pantalla son dinámicas, tuvimos que prestar especial atención al rendimiento de representación.  Desde el punto de vista de la codificación, la hierba, el polvo y las moscas son sprites que deben actualizarse y dibujarse con frecuencia para mantener la atmósfera vívida del juego.  Sumergir al jugador en un entorno de ricos detalles añade sorpresa y placer a la experiencia. Pero si no se hace bien, estos detalles pueden acabar por ser una distracción más que añadir valor.  <br /> <br />Para resolver los problemas de rendimiento que implicaba el complejo entorno de Contre Jour, mantuvimos las partículas del entorno en un lienzo aparte.  También usamos la primitiva lógica de pérdida de fotogramas dentro del motor de partículas para asegurarnos de una experiencia homogénea. En otras palabras, los lotes de partículas se actualizan en cada fotograma, pero solo se dibujan de vez en cuando.  Al hacer esto, pudimos mantener el mundo visualmente detallado de Contre Jour sin afectar al rendimiento.",
    
            groundTitle: "Aspecto del suelo",
            groundMessage: "<div id='groundFigure'></div>Una característica que define a Contre Jour es la forma en que el usuario interactúa con el mundo circundante y lo manipula, en lugar de controlar al héroe del juego.  En Contre Jour, un jugador da forma al suelo arcilloso con el dedo, lo que constituye una de las formas principales de mover al héroe del juego, llamado Petite, por la pantalla. <br/><br/> Portar la lógica del suelo a JavaScript fue un gran desafío. Imitar la forma en que se mueve y toma forma cuando lo toca el usuario, así como la manera en que interactúa con el héroe del juego requirió páginas enteras de lógica embebida en física. Para representar el suelo arcilloso de Contre Jour usamos un puerto JavaScript modificado de <a target='_blank' href='http://code.google.com/p/box2dweb/'>Box2D</a>, que es el mismo motor físico usado en la versión para iOS. Esto nos proporcionó una funcionalidad casi idéntica para administrar los objetos físicos, crear juntas y controlar colisiones. <br /><br/>  El suelo está formado por muchos cuerpos Box2D individuales diferentes; gracias a eso es posible darle forma. Parece suavizarse al trazarlo porque se dibuja una <a target='_blank' href='http://www.w3schools.com/html5/canvas_quadraticcurveto.asp'> curva cuadrática </a> entre cada uno de sus cuerpos secundarios. Esto proporciona al suelo su aspecto arcilloso, pero también hace que sea muy costoso representarlo.",
    
            snotTitle: "Snots",
            snotMessage: "<div id='snotPhysicsFigure'></div>Las cuerdas del juego (llamadas snots) están compuestas realmente de cuatro imágenes independientes (la cabeza, el ojo, el globo ocular y la cola), conectadas entre sí mediante al menos cuatro curvas de Bézier y dos líneas. Los snots se crean encadenando los cuerpos con las juntas en el motor físico de Box2D. <br/><br/>Una vez creados los cuerpos de la cuerda, podemos preguntar por su ubicación. Con estas ubicaciones, iniciamos una ruta en el lienzo y la anexamos a las curvas cuadráticas según las ubicaciones de los cuerpos. Una vez completada la ruta, la dibujamos con negro sólido y realizamos una operación de relleno.",
    
            strongSnotTitle: "Textura de los snots",
            strongSnotMessage: "<div id='snotFigure'></div> Dibujar las cuerdas resultó ser una de las partes más complejas del puerto, porque no hay ninguna forma visual fiable para aplicar una textura a la geometría a través de Canvas API, lo cual es un lugar común en los lenguajes de juegos como OpenGL. <br /><br /> A diferencia de otros juegos, la mayoría de los elementos de Contre Jour se dibujan con procedimientos mediante Canvas API, en lugar de usar imágenes de sprites. Por ejemplo, las cuerdas estáticas que se dibujan de forma dinámica, también contienen un modelo rayado al que no podíamos aplicar fácilmente una textura. Para dibujar estas cuerdas, necesitamos seguir esta serie de pasos: <ol><li>Dividir la cuerda en varias secciones según su longitud.</li><li>Dividir cada sección en dos partes independientes: una superior y una inferior.</li><li>Calcular para las partes superior e inferior de cada sección una transformación independiente, basada en los puntos de la sección y dibujar la mitad adecuada de la textura según esos valores.</li></ol>",
    
            canvasTitle: "Enfoque de lienzos múltiples",
            canvasMessage: "<div id='canvasFigure'></div>Como mencionamos anteriormente, componer varios elementos del juego en varios elementos de HTML5 Canvas es crítico para lograr un buen rendimiento en los juegos complejos basados en explorador.  <br/><br/> Mediante este enfoque, fuimos capaces de actualizar y dibujar selectivamente diferentes partes de la pantalla a distintas velocidades.  Actualizar y dibujar el suelo no es fácil, por eso teníamos que ser selectivos en cuanto a la forma y el momento de representarlo. Cada parte del suelo se representa en su propio HTML5 Canvas, aparte de los otros elementos del juego. Esto fue necesario porque nos permitió desconectar los cambios al suelo de otros elementos del juego y hacer un seguimiento de cada sección del suelo, así como detectar si el usuario la había modificado o no. <br/> <br/> Cada vez que el usuario arrastra o mueve el suelo, marcamos la parte de suelo correspondiente y solo se actualiza y se vuelve a dibujar ese lienzo de suelo concreto. Si hubiéramos dejado el suelo en un solo HTML5 Canvas, el rendimiento habría resultado inaceptable, debido a la representación constante del suelo. Puedes obtener más información sobre cómo lograr un buen rendimiento con escenas complejas en el artículo <a href='http://www.html5rocks.com/en/tutorials/canvas/performance/'>Canvas Performance</a>. <p class='tip' style='margin-left:0px;'>Sugerencia: No todos los elementos del juego tienen que actualizarse y dibujarse con la misma frecuencia. Además al repartir los componentes del juego entre varios lienzos, el dibujo de un gran número de elementos se puede administrar más fácilmente con varias frecuencias durante el bucle del juego. Pero no te vuelvas loco; si amontonas demasiados lienzos, verás que eso afecta al rendimiento.</p>",
    
            //site text
            intro1: "“Contre Jour” es un videojuego que “difumina el límite entre el arte interactivo y los juegos”. Contre Jour, que se ha popularizado en iOS y fue creado por <a href='http://chillingo.com/features/mokus-maksym-hryniv-genius-behind-contre-jour-spea/'>Maksym (Max) Hryniv</a>, es conocido en todo el mundo por su concepto de juego, su estilo artístico fascinante y su banda sonora cautivadora. Con el debut de Internet Explorer 10, Microsoft buscaba una oportunidad para demostrar el motor actualizado de JavaScript y las características avanzadas de multitoque que empaquetaron en su nuevo explorador.",
            intro2: "Los controles de toque ágil, el concepto de juego exclusivo y los requisitos multimedia intensivos de Contre Jour constituían el desafío que Microsoft buscaba. En colaboración con Max y la empresa de desarrollo web <a href='http://www.claritycon.com/'>Clarity Consulting</a>, Internet Explorer ha portado Contre Jour al explorador mediante solo HTML5 y JavaScript. El paso de Contre Jour a la web, completado en 6 meses, ha removido los límites de lo que incluso nosotros creíamos posible y ha demostrado que HTML5 está preparado para la máxima audiencia como una plataforma viable de juego esporádico en la web. El siguiente desglose técnico proporciona información completa de los retos afrontados y las soluciones alcanzadas para llevar a Petite a la vida en el explorador. Esperamos que lo disfrutes.",
            overviewTitle: "Información general",
            overviewText1: "El objetivo del proyecto era demostrar cómo <a target='_blank' href='http://windows.microsoft.com/es-ES/windows-8/internet-explorer'>Internet Explorer 10</a> estaba reduciendo la brecha entre los juegos basados en explorador y los juegos nativos; para ello, había que portar Contre Jour a HTML5. Establecimos desde el principio el objetivo de hacer esto sin sacrificar en absoluto la profundidad de Contre Jour. Sabíamos que encontraríamos desafíos y que no serían pequeños.  Contre Jour es masivo, tanto desde el punto de vista del código como el de los recursos multimedia. Dispone de más de 80 000 líneas de código Objective-C, cientos de activos de imágenes y aún más archivos de configuración. <br /><br /> El mayor desafío, con mucho, fue la conversión del código Objective-C a JavaScript. El código Objective-C estaba fuertemente orientado a objetos y la compatibilidad nativa con JavaScript de los conceptos como <a href='http://en.wikipedia.org/wiki/Encapsulation_(object-oriented_programming)' target='_blank'>encapsulation</a>, <a href='http://en.wikipedia.org/wiki/Polymorphism_in_object-oriented_programming' target='_blank'>polymorphism</a> e <a href='http://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)' target='_blank'>inheritance</a> resulta escasa como poco. Además, las diferencias entre los dos lenguajes excluían por completo el uso de un puerto línea por línea.  Repasamos el código Objective-C en detalle, evaluamos cada componente para determinar su relación con otros componentes e ideamos una manera de implementar cada uno fielmente en JavaScript.",
            overviewText2: "Desde el principio, como siempre ocurre en el desarrollo de juegos, el rendimiento era indispensable.  Nos preocupaba que hacer el seguimiento de muchos elementos (incluido el entorno) y moverlos por la pantalla, afectara potencialmente al explorador.  HTML5 simplifica hacer el dibujo, pero teníamos que seguir reconociendo el hecho de que esa sería la operación más costosa con respecto al rendimiento. Mira la siguiente sección “Bajo la capucha” para ver algunos de los trucos de rendimiento que utilizamos.",
    
            techTitle: "Mas tecnología HTML5",
            techTitle2: "De Objective-C a JavaScript",
            techText1: "Uno de nuestros primeros desafíos fue portar la profunda jerarquía de objetos de Contre Jour del código iOS original a JavaScript.  Como ayuda para esto, nos basamos en <a href='http://ejohn.org/blog/simple-javascript-inheritance/' target='_blank'>John Resig’s “Simple JavaScript Inheritance” pattern</a> en varios lugares donde necesitábamos la herencia. <br/> <br/>Esto nos permitió usar mucho código de la arquitectura Open-C de Contre Jour, más de lo que habíamos previsto.  Los componentes del juego, por ejemplo, los sistemas de partículas, que compartían comportamientos base comunes, fueron más fáciles de implementar porque teníamos una jerarquía de “herencia” que evitaba la necesidad de escribir todo a partir de cero cada vez.  Sin un modelo como este, habría sido muy difícil, si no imposible, portar el juego a HTML.  Tendríamos que haber rescrito finalmente la mayor parte del juego. Afortunadamente, usar un modelo Simple JavaScript Inheritance nos ahorró mucho tiempo y recursos.",
    
            css3Title: "CSS3",
            css3Text1: "<a href='http://www.w3schools.com/css3/css3_animations.asp' target='_blank'>CSS animations</a> y <a href='http://www.w3schools.com/css3/css3_transitions.asp' target='_blank' > transitions</a> desempeñaron un gran papel en el desarrollo de los menús y de los elementos no conceptuales del juego. La mayoría de estas transiciones CSS se producen durante las transiciones de pantalla o los eventos del juego, como mostrar y ocultar el menú de pausa, cambiar entre los niveles o cambiar entre un nivel y el selector de nivel.  En los exploradores como Internet Explorer 10, cada píxel de la pantalla se acelera por hardware. ¿Qué significa esto? Significa que, sin necesidad de código adicional, tienes la capacidad de crear efectos de alta fidelidad y alto rendimiento. Esto nos ayudó a descargar una parte del trabajo de representación del ya muy utilizado lienzo en el motor de diseño DOM y CSS. ",
            css3Text2: "También usamos <a href='http://ie.microsoft.com/testdrive/HTML5/CSS3MediaQueries/' target='_blank'>CSS3 Media Queries</a> para escalar el sitio con el fin de que admitiera varias resoluciones de pantalla.  Las consultas de medios CSS3 permiten a los desarrolladores adjuntar una condición que afecta al ámbito al que se aplica el estilo.  Por ejemplo, usamos una consulta de medios para aplicar una transformación de escala a nuestro contenedor DIV externo, con el fin de reducir el sitio para pantallas más pequeñas.",
            css3Text3: "<b>Sugerencia</b>: Realizar el escalado mediante las consultas de medios nos liberó de la carga de crear y dar soporte técnico a varios tamaños de imágenes.  Esta es una optimización importante, ya que mantener varios conjuntos de imágenes habría causado dificultades adicionales porque teníamos cientos de imágenes para administrar.",
    
            multiTouchTitle: "Multitoque",
            multiTouchText1: "Una de las pocas áreas del juego en las que usamos código específico del explorador es la implementación de la compatibilidad con multitoque.  La implementación de multitoque fue una de las partes más sencillas del desarrollo, gracias a la compatibilidad integrada de Internet Explorer 10 con las escuchas de eventos de toque. Lo bueno es que funcionó sin más.  Desde el punto de vista del desarrollador, esto era fantástico, porque nos permitía concentrarnos en las partes más desafiantes del proyecto. A continuación mostramos un ejemplo de código con las escuchas de eventos de toque conectadas:",
            multiTouchText2: "Desde el punto de vista de la codificación, empleamos más tiempo en escribir un módulo de toque principal que se ajustara a la compatibilidad de toque específica del explorador y al control de eventos de toque.  El módulo hace un seguimiento de los eventos de toque, independientemente de la plataforma del explorador, y los sube a nuestro motor de juego para el procesamiento. Además, los elementos del juego pueden “suscribirse” a una instancia dada de un toque para recibir notificaciones a lo largo del ciclo de vida de los eventos de toque inicial, movimiento y toque final. Esto simplificó que los elementos del juego, como, por ejemplo, el suelo, respondan a los eventos de toque entre distintas plataformas de explorador.",
    
            downloadTitle1: "¿Eres desarrollador?",
            helpMessage2: "DESCARGA Html5 Game Pack aquí",
            downloadText1: "Si eres un desarrollador web interesado en la creación de juegos en la web, hemos ensamblado <br/> un <a href='downloads/HTML5GameKit.zip'>marco de trabajo inicial</a> que puedes usar directamente para empezar a crear juegos HTML5.",
            downloadText2: "En el ejemplo se usa el mismo modelo utilizado para crear el bucle de juego en Contre Jour, que te ayudará a empezar a escribir juegos HTML5. Incluye un modelo sencillo para crear un bucle de juego, un objeto de juego inicial y código para dibujar en el lienzo, todo ello configurado y listo para usar.  El código está bien documentado y te guiará por los pasos necesarios para crear un juego básico. También puedes consultar algunos recursos adicionales para el desarrollador aquí:",
            downloadText3: "<a href='https://github.com/InternetExplorer'>Repositorio de GitHub para Internet Explorer</a>: Para usuarios intermedios y avanzados. Nuestro repositorio de GitHub compila una gran parte del trabajo que hemos hecho durante los últimos meses, desde la creación del juego con <a href='http://www.atari.com/arcade' target='_blank'>Atari<a/> y <a href='http://www.cuttherope.ie/' target='_blank'>Cut The Rope</a>, hasta el desarrollo de <a href='http://www.justafriend.ie/' target='_blank'>vídeos de música interactivos con Jasmine Villegas.</a>",
            //   	    downloadText4 : "<a href='#'>Microsoft Developer Network</a> - For web developers of all levels, check out the Microsoft Developer Network site for Internet Explorer where you can learn everything you need to know about building for next generation browsers, getting your site touch-ready, and more!",
    
            conclusionTitle1: "¿Qué viene después?",
            conclusionText1: "El hecho de que hayamos portado Contre Jour a la web ha demostrado varias cosas. La menos importante de ellas es que la frontera entre los juegos de explorador HTML5 y los juegos de plataforma nativa se está difuminando. Aunque los juegos nativos siguen proporcionando una ventaja sobre los juegos de explorador con respecto a la riqueza, las oportunidades de llegar a más público que aporta el explorador resultan muy atractivas. A medida que las tecnologías como Windows 8 e Internet Explorer 10 sigan avanzando, el futuro de los juegos HTML5 es cada vez más prometedor.  Como desarrolladores, creemos que nos compete cambiar las expectativas de las personas sobre lo que es posible en la web.  Esperamos que Contre Jour inspire a la comunidad de juegos para remover los límites y explorar nuevas posibilidades. ¿Qué te parece posible?",
    
            screenshotLink1Text: "Algunos elementos del juego, como los menús, utilizaron elementos DOM y animaciones CSS para un rendimiento acelerado del hardware. Esto nos ayudó a descargar una parte del trabajo de representación del lienzo HTML5 en el motor de diseño DOM y CSS.",
            screenshotLink2Text: "Algunos elementos del juego, como los menús, utilizaron elementos DOM y animaciones CSS para un rendimiento acelerado del hardware. Esto nos ayudó a descargar una parte del trabajo de representación del lienzo HTML5 en el motor de diseño DOM y CSS."
        },
    
        'de': {
            //under the hood section
            underTheHoodTitle: "Unter der Haube",
            helpMessage: "SPIELEN SIE DAS SPIEL",
            helpMessage1: "BEREICH FÜR WEITERE INFORMATIONEN ANKLICKEN",
    
            particleTitle: "Details zu Partikeln und dem Spiel",
            particleMessage: "Da die vielen sich bewegenden Teilchen auf dem Bildschirm dynamisch sind, mussten wir besonders auf die Rendering-Leistung achten.  Aus Programmiersicht müssen die Sprites für Gras, Staub und Fliegen häufig aktualisiert und gezeichnet werden, um die lebendige Atmosphäre des Spiels zu erhalten.  Indem Spielerinnen und Spieler in eine reiche, detaillierte Umgebung eintauchen, wird ihr Erlebnis gespickt mit Überraschungen und Freude. Wenn das aber auf die falsche Weise passiert, tragen diese Details nicht zur Atmosphäre bei, sondern lenken ab.  <br /> <br />Um also die komplexen Umgebungen von Contre Jour und ihre Auswirkungen auf die Leistung in den Griff zu bekommen, haben wir die Partikel auf einer eigenen Ebene verwaltet.  Eine primitive Frame-Drop-Logik in der Partikel-Engine trägt zum ruckelfreien Erlebnis bei. Einfach gesagt werden Partikelgruppen zwar für jeden Frame aktualisiert, aber nur hin und wieder gezeichnet.  So können wir einen detaillierten visuellen Eindruck in Contre Jour erreichen, ohne dass die Leistung einbricht.",
    
            groundTitle: "Bodenphysik",
            groundMessage: "<div id='groundFigure'></div>Das Besondere an Contre Jour ist die Interaktion und Manipulation der Welt ohne direkte Einwirkung auf die Hauptfigur.  In Contre Jour wird der Boden wie Ton mit dem Finger geformt, um die Hauptfigur namens Petite in Bewegung zu versetzen. <br/><br/> Diese Bodenlogik in JavaScript zu übertragen war eine große Herausforderung. Um die Bewegungen sowie Formen als Ergebnis der Fingergesten und die Interaktion mit der Heldenfigur in Einklang zu bringen, war seitenweise Code mit Physiklogik erforderlich. Für den Boden am Tag verwenden wir in Contre Jour einen modifizierten JavaScript-Port von <a target='_blank' href='http://code.google.com/p/box2dweb/'>Box2D</a>; diese Physik-Engine kommt auch unter iOS zum Einsatz. So erzielen wir eine nahezu identische Funktionalität bei der Verarbeitung von Physikobjekten, bei Verbindungen und bei Kollisionen. <br /><br/>  Der Boden besteht aus vielen einzelnen Box2D-Körpern; nur so ist seine Formbarkeit gegeben. Das glatte, nahtlose Erscheinungsbild ist einer <a target='_blank' href='http://www.w3schools.com/html5/canvas_quadraticcurveto.asp'> quadratischen Kurve </a> zu verdanken, die zwischen den einzelnen Teilkörpern eingesetzt wird. So wird der Boden formbar wie Ton, aber leider auch sehr aufwendig zu rendern.",
    
            snotTitle: "Ranken",
            snotMessage: "<div id='snotPhysicsFigure'></div>Die Seile (im Spiel Ranken genannt) bestehen eigentlich aus vier Einzelbildern (Kopf, Auge, Augapfel und Schwanz), die über mindestens vier Bezierkurven und zwei Linien miteinander verbunden werden. Diese Ranken entstehen durch das Verbinden von Körpern mithilfe von Gelenken oder Verbindungen in der Physik-Engine Box2D. <br/><br/>Sobald die Rankenkörper erzeugt worden sind, können wir die Position dieser Körper abfragen. Anhand der Positionen erstellen wir einen Canvas-Pfad auf der Ebene und hängen diesen auf Basis der Körperpositionen an die quadratischen Kurven an. Sobald der Pfad abgeschlossen ist, zeichnen wir ihn schwarz und füllen ihn anschließend.",
    
            strongSnotTitle: "Rankentexturen",
            strongSnotMessage: "<div id='snotFigure'></div> Das Zeichnen der Ranken ist in der Tat der wohl komplexeste Teil des Ports, denn es gibt keine visuell zuverlässige Methode, einer Geometrie über das Canvas-API eine Textur zuzuweisen. Jetzt ist dieses API aber wie OpenGL in Sprachen für die Spieleprogrammierung weit verbreitet. <br /><br /> Anders als in anderen Spielen werden viele der Elemente in Contre Jour prozedural mithilfe des Canvas-API gezeichnet, nicht mit Sprites. So enthalten die statischen Ranken (die dynamisch gezeichnet werden) auch ein Streifenmuster, dem wir nicht so einfach eine Textur zuweisen konnten. Für diesen Ranken kommt daher diese Schrittfolge zum Einsatz: <ol><li>Teile die Ranke abhängig von ihrer Länge in mehrere Abschnitte.</li><li>Teile jeden Abschnitt in zwei Einzelteile – ein Ober- und ein Unterteil.</li><li>Berechne für jedes Ober- und Unterteil in jedem Abschnitt eine separate Transformation auf Basis der Abschnittspunkte und zeichne die passende Hälfte der Textur anhand dieser Werte.</li></ol>",
    
            canvasTitle: "Multiple-Canvas-Ansatz",
            canvasMessage: "<div id='canvasFigure'></div>Wie bereits erwähnt ist das Zusammenstellen verschiedener Spielelemente auf mehreren HTML5-Canvas-Elementen für eine gute Leistung in komplexen Browser-Spielen immens wichtig.  <br/><br/> Mit diesem Ansatz können wir verschiedene Bereiche des Bildschirms mit unterschiedlichen Bildwiederholraten ansteuern und so aktualisieren bzw. neu zeichnen.  Speziell das Aktualisieren und Zeichnen des Bodens kostet viel Rechenleistung, weswegen wir hier besonders sorgfältig abwägen, wo und wie ein Rendering erforderlich ist. Jedes Stück Boden wird auf einem eigenen HTML5-Canvas getrennt von den anderen Elementen des Spiels gerendert. Das ist nötig, weil wir so Änderungen am Boden von den anderen Spielelementen trennen können; jeder Abschnitt des Bodens wird nämlich überwacht, um zu prüfen, ob es vom Spieler bzw. der Spielerin verändert worden ist. <br/> <br/> Wann immer der Boden gezogen oder verschoben wird, markieren wir das betroffene Stück Boden. Dann wird nur der Canvas für dieses Stück aktualisiert und neu gezeichnet. Wäre der gesamte Boden auf einem HTML5-Canvas, würde er ständig neu gerendert werden müssen und die Leistung würde extrem einbrechen. Der Artikel <a href='http://www.html5rocks.com/en/tutorials/canvas/performance/'>Canvas Performance</a> enthält Tipps für mehr Leistung in komplexen Szenen. <p class='tip' style='margin-left:0px;'>Tipp: Es müssen nicht alle Spielelemente mit derselben Häufigkeit aktualisiert und gezeichnet werden. Durch den Einsatz von mehreren Canvas-Elementen kann eine Vielzahl von Elementen während des Game-Loops mit unterschiedlichen Frequenzen gezeichnet und verwaltet werden. Allerdings darf auch das nicht übertrieben werden: Zu viele Canvas-Elemente übereinander führen ebenfalls zu einem Einbruch.</p>",
    
            //site text
            intro1: "„Contre Jour“ ist ein Videospiel, in dem „die Grenzen zwischen Spiel und interaktiver Kunst“ verwischt werden. Unter iOS zum Star geworden und geschaffen von <a href='http://chillingo.com/features/mokus-maksym-hryniv-genius-behind-contre-jour-spea/'>Maksym (Max) Hryniv</a> ist Contre Jour weltweit für das innovative Gameplay, die charmante Grafik und den fesselnden Soundtrack bekannt. Mit dem Debüt des Internet Explorer 10 hat Microsoft eine Möglichkeit gesucht, die aktualisierte JavaScript-Engine und die modernen Multitouch-Funktionen des neuen Browsers zu zeigen.",
            intro2: "Contre Jours schicke Touchbedienung, das einzigartige Gameplay und die intensiven Multimediaanforderungen boten genau die richtige Herausforderung für Microsoft. Gemeinsam mit Max und den Entwicklern von <a href='http://www.claritycon.com/'>Clarity Consulting</a> wurde Contre Jour allein mit HTML5 und JavaScript für Internet Explorer portiert. Nach über 6 Monaten Entwicklungszeit hat die Portierung von Contre Jour für das Web die Grenzen dessen, was wir für möglich hielten, versetzt; es beweist, dass sich HTML5 als Plattform für Casual Gaming im Web nicht verstecken muss. Die folgende technische Betrachtung enthält vielfältige Einblicke in die Herausforderungen und Lösungen, die Petite im Browser zum Leben erwecken. Wir hoffen, Sie haben Spaß daran.",
            overviewTitle: "Überblick",
            overviewText1: "Das Ziel des Projekts war es, zu zeigen, wie <a target='_blank' href='http://windows.microsoft.com/de-DE/windows-8/internet-explorer'>Internet Explorer 10</a> die Lücke zwischen Browser-Spielen und normalen Titeln schließt. Dazu sollte Contre Jour in HTML5 portiert werden. Unser erklärtes Ziel war von Anfang an, dass Contre Jour nichts von seiner Spieltiefe verlieren darf. Wir wussten, dass wir uns damit wirklich großen Herausforderungen stellen würden.  Contre Jour ist groß – sowohl was den Code betrifft, als auch für die Medien. Es enthält mehr als 80.000 Zeilen Objective-C-Code, Hunderte von Bildelementen und noch mehr Konfigurationsdateien. <br /><br /> Die größte Herausforderung war die Konvertierung von Objective-C in JavaScript. Der Objective-C-Code ist sehr objektlastig; dagegen unterstützt JavaScript Konzepte wie <a href='http://de.wikipedia.org/wiki/Datenkapselung_(Programmierung)' target='_blank'>Datenkapselung</a>, <a href='http://de.wikipedia.org/wiki/Polymorphie_(Programmierung)' target='_blank'>Polymorphie</a> und <a href='http://de.wikipedia.org/wiki/Vererbung_(Programmierung)' target='_blank'>Vererbung</a> nur spärlich – wenn überhaupt. Außerdem schließen die Unterschiede zwischen den beiden Sprachen eine zeilenweise Portierung gänzlich aus.  Wir haben uns den Objective-C-Code detailliert angesehen, jede Komponente analysiert, ihre Beziehung zu anderen Komponenten entwirrt und für jede davon eine Methode entwickelt, um sie getreu in JavaScript zu implementieren.",
            overviewText2: "Von Anfang an war auch klar, dass Leistung – ergo Geschwindigkeit – ein Muss ist.  Besonders besorgt waren wir, ob der Browser wohl mit dem Verfolgen und Bewegen der vielen Elemente und der Umgebung zurecht kommen würde.  HTML5 vereinfacht das Zeichnen; aber das Zeichnen würde nicht unsere größte Herausforderung oder die leistungshungrigste Funktion sein. Lesen Sie im Abschnitt „Unter der Haube“ welche Performancetricks wir genutzt haben.",
    
            techTitle: "Für HTML5-Techies",
            techTitle2: "Von Objective-C nach Javascript",
            techText1: "Eine der wohl zentralen Herausforderungen ist die Portierung der tiefen Objekthierarchie in Contre Jour vom ursprünglichen iOS-Code nach JavaScript.  Wo Vererbung nötig war, haben wir deshalb dankbar die Unterstützung des <a href='http://ejohn.org/blog/simple-javascript-inheritance/' target='_blank'>„Simple JavaScript Inheritance“-Schemas von John Resig</a> benutzt. <br/> <br/>So konnten wir viel mehr Code aus der Open-C-Architektur von Contre Jour verwenden, als zuerst gedacht.  Komponenten des Spiels wie die Partikelsysteme, in denen grundlegende Verhaltensweisen wiederholt genutzt worden sind, konnten wir dank der Vererbungshierarchie einfacher implementieren, denn wir mussten nicht jedes Mal von vorn beginnen.  Ohne ein derartiges Schema wäre es in der Tat schwierig bis unmöglich gewesen, das Spiel für HTML zu portieren.  Stattdessen wäre wohl in großen Zügen eine Neuprogrammierung angesagt gewesen. Zum Glück konnten wir mit dem „Simple JavaScript Inheritance“-Schema jede Menge Zeit und Ressourcen sparen.",
    
            css3Title: "CSS3",
            css3Text1: "<a href='http://www.w3schools.com/css3/css3_animations.asp' target='_blank'>CSS-Animationen</a> und <a href='http://www.w3schools.com/css3/css3_transitions.asp' target='_blank' >-Übergänge</a> spielten eine große Rolle in der Entwicklung von Menüs und anderen, nicht spielbezogenen Elementen des Spiels. Die meisten dieser CSS-Übergänge erfolgen im Rahmen von Bildschirmübergängen oder Spielevents, beispielsweise beim Ein- und Ausblenden des Pausemenüs, beim Level-Wechsel oder beim Übergang zwischen Level und Level-Auswahl.  In Browsern wie Internet Explorer 10 ist jeder Bildpunkt hardwarebeschleunigt. Was bedeutet das? Das bedeutet, dass sich ohne eine Zeile Code hochwertige und leistungsstarke Effekte erzeugen lassen. So konnten wir einen Teil der Rendering-Aufgaben von den intensiv genutzten Canvas-Elementen auf das DOM und die CSS-Layout-Engine verschieben. ",
            css3Text2: "Wir haben außerdem zur Unterstützung unterschiedlicher Bildschirmauflösungen <a href='http://ie.microsoft.com/testdrive/HTML5/CSS3MediaQueries/' target='_blank'>CSS3-Medienabfragen</a> zum Skalieren verwendet.  CSS3-Medienabfragen ermöglichen das Anhängen von Bedingungen, die den Anwendungsbereich für einen Stil beeinflussen.  So haben wir per Medienabfrage eine Skalierung auf den äußeren DIV-Container angewandt, um diesen für kleinere Bildschirme herunter zu skalieren.",
            css3Text3: "<b>Tipp</b>: Das Skalieren mittels Medienabfragen hat uns das Anlegen und Verwalten von Bildern in verschiedenen Größen erspart.  Das ist eine wichtige Optimierung, denn die Verwaltung mehrerer Bildsätze hätte bei der bereits hohen Anzahl weitere Ressourcen gekostet.",
    
            multiTouchTitle: "Multitouch",
            multiTouchText1: "Einer der wenigen Bereiche des Spiels, in dem wir auf den Browser zugeschnittenen Code verwendet haben, ist die Multitouch-Unterstützung.  Dank der in Internet Explorer 10 enthaltenen Unterstützung für Touch-Event-Listener war das allerdings eine der einfacheren Aufgaben. Das Tolle daran: Sie funktionieren einfach.  Aus Entwicklungssicht ist das großartig, denn wir konnten uns kopfüber in die echten Herausforderungen des Projekts stürzen. Hier ist ein Codebeispiel, bei dem die Touch-Event-Listener zum Einsatz kommen:",
            multiTouchText2: "Aus Programmiersicht haben wir einige Zeit mit dem Schreiben eines Touch-Moduls verbracht, das den browserspezifischen Touch-Support und die Touch-Event-Verarbeitung verwaltet.  Das Modul verfolgt Touch-Events auf jeder Browser-Plattform und reicht sie zur Verarbeitung an unsere Game-Engine weiter. Außerdem können Spielelemente bestimmte Instanzen eines Touch „abonnieren“ und so alle Informationen von Touch-Beginn über die Bewegung bis hin zum Touch-Ende erhalten. Das machte es einfach, Elemente wie den Boden auf allen Browser-Plattformen auf Touch-Events reagieren zu lassen.",
    
            downloadTitle1: "Entwickeln Sie selbst?",
            helpMessage2: "LADEN Sie das „Html5 Game Pack“ hier herunter.",
            downloadText1: "Wenn Sie für das Web entwickeln und bereits mit der Spieleentwicklung geliebäugelt haben,<br/>dann sollten Sie sich unser <a href='downloads/HTML5GameKit.zip'>Einsteiger-Framework</a> ansehen, mit dem Sie sofort loslegen und<br/>HTML5-Titel entwickeln können.",
            downloadText2: "Das Beispiel nutzt das Schema, das auch wir für den Game-Loop in Contre Jour eingesetzt haben. So werden Sie schnell mit HTML5 für Spiele vertraut. Es enthält ein einfaches Schema zum Erstellen der Game-Loop, ein erstes Game-Objekt und Code zum Zeichnen des Canvas-Elements – alles fix und fertig startklar.  Der Code ist gut dokumentiert und führt Sie durch die Schritte zum Erstellen eines einfachen Spiels. Weitere Entwicklungsressourcen finden Sie hier:",
            downloadText3: "<a href='https://github.com/InternetExplorer'>Internet Explorer GitHub Repository</a> für alle, die die ersten Schritte hinter sich gelassen haben. Das GitHub-Repository enthält viele der tollen Arbeiten, die wir in den letzten Monaten erstellt haben, angefangen beim Schreiben von Spielen mit <a href='http://www.atari.com/arcade' target='_blank'>Atari<a/> und <a href='http://www.cuttherope.ie/' target='_blank'>Cut The Rope</a> bis hin zur Entwicklung von <a href='http://www.justafriend.ie/' target='_blank'>interaktiven Musikvideos mit Jasmine Villegas.</a>",
            //   	    downloadText4 : "<a href='#'>Microsoft Developer Network</a> - For web developers of all levels, check out the Microsoft Developer Network site for Internet Explorer where you can learn everything you need to know about building for next generation browsers, getting your site touch-ready, and more!",
    
            conclusionTitle1: "Wie geht es jetzt weiter?",
            conclusionText1: "Das wir Contre Jour ins Web gebracht haben, beweist verschiedene Dinge. Den Grundstein legt die Tatsache, dass die Grenze zwischen HTML5-Browserspielen und für bestimmte Plattformen entwickelte Titel verschwimmt. Für Einzelplattformen entwickelte Spiele haben derzeit beim Umfang zwar noch die Nase vorn, aber die Publikumsgröße, die sich mit einem Browser erreichen lässt, ist überaus verlockend. Mit dem Voranschreiten von Technologien wie Windows 8 und Internet Explorer 10 wird auch die Zukunft von HTML5-Spielen immer rosiger.  Als Entwicklerteam sind wir der festen Überzeugung, das wir die Erwartungen ans Web neu definieren können.  Wir hoffen, dass Contre Jour die Gaming-Community ermuntert, die Grenzen zu überschreiten und in das Neuland der Möglichkeiten vorzudringen. Was halten Sie für möglich?",
    
            screenshotLink1Text: "Einige Spielelemente wie Menüs verwenden DOM-Elemente und CSS-Animationen für eine höhere Geschwindigkeit durch Hardwarebeschleunigung. Auf diese Weise konnte ein Teil des Rendering vom HTML5-Canvas auf die DOM- und CSS-Layout-Engine übertragen werden.",
            screenshotLink2Text: "Einige Spielelemente wie Menüs verwenden DOM-Elemente und CSS-Animationen für eine höhere Geschwindigkeit durch Hardwarebeschleunigung. Auf diese Weise konnte ein Teil des Rendering vom HTML5-Canvas auf die DOM- und CSS-Layout-Engine übertragen werden."
        },
    
        'ch': {
    
             //under the hood section
             underTheHoodTitle: "深入了解",
             helpMessage: "玩游戏",
             helpMessage1: "点击任一点了解详情",
    
             particleTitle: "粒子和游戏详情",
             particleMessage: "因为填充屏幕的许多移动粒子都是动态的，所以我们必须仔细留意渲染效果。从编码的角度看，草、灰尘和苍蝇这些子画面需要频繁更新和绘制，以营造出游戏灵动的氛围。从而让玩家完全融入具有丰富细节的环境，获得充满惊喜的愉悦体验。但是，如果处理不当，这些细节最后可能会成为干扰因素，而非额外优势。<br /> <br />为解决 Contre Jour 的复杂环境带来的效果问题，我们将环境粒子保持在单独的画布上。此外，我们在粒子引擎中使用了基元丢帧逻辑以确保流畅的玩家体验。也就是说，粒子逐帧批量更新，但绘制粒子的频率要低得多。这样一来，我们既确保了 Contre Jour 充满丰富视觉细节的环境，又避免了效果上的影响。",
    
             groundTitle: "场景的物理原理",
             groundMessage: "<div id='groundFigure'></div>Contre Jour 最鲜明的特色是让用户与周围环境互动并控制周围环境（而不是控制游戏中的英雄角色）。在 Contre Jour 中，玩家通过手指操作使粘土般的场景改变形状，这是在屏幕上移动该游戏的英雄角色 Petite 的主要方式之一。<br/><br/> 将场景逻辑引入 JavaScript 是一个巨大的挑战。对用户触摸场景时场景移动和改变形状的方式以及场景与游戏英雄的互动方式进行模拟，这需要大量的物理逻辑。为了渲染 Contre Jour 的粘土状场景，我们使用了 <a target='_blank' href='http://code.google.com/p/box2dweb/'>Box2D</a> 的改进的 JavaScript 端口，这与 iOS 版本使用的物理引擎相同。这使得我们在管理物理对象、创建接点和解决冲突方面基本实现了功能上的一致性。<br /><br/>  场景由许多不同的单个 Box2D 物体组成，从而具有了改变形状的能力。因为在场景中的每一个子物体间绘制了一条<a target='_blank' href='http://www.w3schools.com/html5/canvas_quadraticcurveto.asp'>二次曲线</a>，所以绘制场景时，视觉呈现非常流畅。这虽然能赋予场景粘土般的质感，但也让相关的渲染处理变得非常昂贵。",
    
             snotTitle: "Snot",
             snotMessage: "<div id='snotPhysicsFigure'></div>该游戏中的绳索（又名 snot）实际上是由四种不同的独立图像（头部、眼睛、眼球和尾巴）组成，这些图像通过至少四条 Bezier 曲线和两条直线相连接。在 Box2D 物理引擎中通过将物体与接点相连创建出这些 snot。<br/><br/>绳索体创建后，我们需要对绳索体进行定位。借助这些位置，我们生成画布路径并基于物体位置为其添加二次曲线。路径生成完毕后，我们用纯黑色描边并执行填充操作。",
    
             strongSnotTitle: "Snot 纹理",
             strongSnotMessage: "<div id='snotFigure'></div> 绘制绳索结果是端口最复杂的部分之一，因为还没有一种方法能直观而可靠地将纹理通过画布 API 应用于几何图形，而这对于类似 OpenGL 的游戏语言来说，却很常见。<br /><br /> 与其他游戏不同，Contre Jour 的许多游戏元素采用画布 API（而非 sprite 图像）进行程序性绘制。例如，通过动态方式绘制的静态绳索包含条纹图案，这使得我们无法轻易地将纹理应用于其中。为绘制此类绳索，我们需要遵循以下步骤：<ol><li>根据绳索的长度，将绳索分成多个部分。</li><li>将每部分分成两个单独的层 - 顶层和底层。</li><li>针对每部分的顶层和底层，根据该部分的点来计算单独的转换并根据相关值来绘制纹理相应半部分。</li></ol>",
    
             canvasTitle: "多层画布方法",
             canvasMessage: "<div id='canvasFigure'></div>如前所述，要想在基于浏览器的复杂游戏中获得良好效果，将多种游戏元素与多种 HTML5 画布元素融合是至关重要的。<br/><br/> 借助此方法，我们能够有选择性地以不同的比率来更新和绘制屏幕的不同部分。更新和绘制场景的花费不低，所以我们需要对其渲染时间和方式进行谨慎选择。场景的每层在其所属的 HTML5 画布上渲染，与其他游戏元素分离。这样做很有必要，由此我们能通过跟踪每个场景部分并检测用户是否对其进行过改动来确保场景的改变不受游戏中其他元素的影响。<br/> <br/> 每当用户拖动或移动场景时，我们会标记受影响的场景层，并且只对该场景层的特定画布进行更新和重新绘制。如果我们将场景置于单一的 HTML5 画布，那么场景的持续渲染将会使效果差到无法接受的程度。如果想了解如何在复杂场景中实现优质效果，您可以参阅题为<a href='http://www.html5rocks.com/en/tutorials/canvas/performance/'>画布效果</a>的文章。<p class='tip' style='margin-left:0px;'>提示：并不是所有的游戏元素都需要以相同的频率进行更新和绘制。通过将游戏的各部分分散于多层画布，您可以更加轻松地在游戏循环中以不同的频率绘制大量元素。但也不能太过极端。如果您将太多的画布相互重叠，那么效果会受到影响。</p>",
    
             //site text
             intro1: "“Contre Jour”是一款“让游戏与互动艺术的界限变得模糊”的视频游戏。Contre Jour 由 <a href='http://chillingo.com/features/mokus-maksym-hryniv-genius-behind-contre-jour-spea/'>Maksym (Max) Hryniv</a> 推出，在 iOS 上大获追捧，因其创新的游戏设置、奇幻的艺术风格以及动人的背景音乐而享誉世界。自 Internet Explorer 10 推出后，Microsoft 就一直在寻找适当的机会来展示其应用于全新浏览器的更新的 JavaScript 引擎和高级多点触控功能。",
             intro2: "Contre Jour 灵敏的触控功能、独特的游戏设置和对多媒体的深入要求恰好提供了 Microsoft 所需的这种挑战。通过与 Max 以及网站开发机构 <a href='http://www.claritycon.com/'>Clarity Consulting</a> 的合作，Internet Explorer 仅使用 HTML5 和 JavaScript 便将 Contre Jour 导入了浏览器。导入过程耗时 6 个多月。将 Contre Jour 导入网页的成功之举拓展了我们以往所认知的可能性极限 - 它证明了 HTML5 作为一种可行平台，已经为促进网页休闲游戏的发展做好了准备。以下技术分析对在浏览器中赋予 Petite 灵动的生命力所面临的挑战及其解决方案进行了深入的阐述。希望您能喜欢。",
             overviewTitle: "概述",
             overviewText1: "该项目的目标是展示 <a target='_blank' href='http://windows.microsoft.com/zh-cn/windows-8/internet-explorer'>Internet Explorer 10</a> 是如何通过将 Contre Jour 导入 HTML5 来缩小基于浏览器的游戏与原生游戏间的差距的。我们从一开始就设立了一个目标 - 我们会在不牺牲 Contre Jour 深度的前提下缩短这一差距。我们深知将面临巨大的挑战。无论从代码方面，还是从媒体方面看，Contre Jour 都是非常强大的。该游戏拥有 80,000 行 Objective-C 代码、数以百计的图像资源以及数量更多的配置文件。<br /><br /> 迄今为止，最大的挑战是将 Objective-C 代码转换为 JavaScript。Objective-C 代码具有高度的面向对象性，而 JavaScript 对于像<a href='http://en.wikipedia.org/wiki/Encapsulation_(object-oriented_programming)' target='_blank'>封装</a>、<a href='http://en.wikipedia.org/wiki/Polymorphism_in_object-oriented_programming' target='_blank'>多形性</a>和<a href='http://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)' target='_blank'>继承</a>这样的概念的原生支持，即使在最好的情况下，也是稀疏的。此外，由于两种语言存在差异，所以无法实现直接的逐行导入。我们逐一检查 Objective-C 代码、评估每个部分，从而确定每个部分与其他部分相连的方式，并且还设计了一种方法以忠实地在 JavaScript 中实施每个部分。",
             overviewText2: "正如游戏开发一如既往的那样，从一开始效果就是必不可少的。我们曾担心对屏幕中的许多元素（包括环境）进行跟踪和移动可能会给浏览器带来负担。HTML5 虽然简化了绘图操作，但我们也需要认识到这样一个事实：绘图将成为与效果相关的最昂贵的操作。有关我们所使用的提升效果的诀窍，请参阅以下“深入了解”部分。",
    
             techTitle: "更多 HTML5 技术",
             techTitle2: "从 Objective-C 到 Javascript",
             techText1: "我们在初期遇到的主要挑战之一是将 Contre Jour 的深层对象层次结构从原始 iOS 代码导入 JavaScript。为此，我们在需要使用继承的地方，采用了 <a href='http://ejohn.org/blog/simple-javascript-inheritance/' target='_blank'>John Resig 的“简单 JavaScript 继承”模式</a>。<br/> <br/>这让我们能够使用来自 Contre Jour 的 Open-C 架构的大量代码，其数量超乎我们的预期。该游戏中具有共同基础行为的部分（例如，粒子系统）较容易实施，因为我们采用的“继承”层次结构可以避免每次都从头开始写入所有代码。如果没有此类模式，即使有可能将游戏导入 HTML，也会非常困难。这样一来，我们最后将必须重写该游戏的大部分内容。得益于“简单 JavaScript 继承”模式，我们节省了大量的时间和资源。",
    
             css3Title: "CSS3",
             css3Text1: "<a href='http://www.w3schools.com/css3/css3_animations.asp' target='_blank'>CSS 动画效果</a>和<a href='http://www.w3schools.com/css3/css3_transitions.asp' target='_blank' > 过渡效果</a>在该游戏的菜单和非游戏设置元素的开发方面发挥了巨大作用。大多数的 CSS 过渡发生在屏幕过渡或游戏事件中，例如显示/隐藏“暂停”菜单、在等级间过渡或在等级和等级选择器间过渡。在诸如 Internet Explorer 10 的浏览器中，对屏幕中的每一个像素都进行了硬件加速。这意味着什么？这意味着您无需添加任何代码，就能够实现高保真、高性能的效果。这有助于我们将一些渲染工作从已经不堪重负的画布上转移到 DOM 和 CSS 布局引擎。",
             css3Text2: "此外，我们使用 <a href='http://ie.microsoft.com/testdrive/HTML5/CSS3MediaQueries/' target='_blank'>CSS3 Media Query</a> 来按比例调节格点以支持不同的屏幕分辩率。CSS3 Media Query 使开发人员能使用条件来影响风格的应用范围。例如，我们借助 media query 将比例变换应用于外部 DIV 容器，从而为较小的屏幕按比例缩小格点。",
             css3Text3: "<b>提示</b>：使用 Media Query 来进行按比例调节使得我们摆脱了创建和支持多种尺寸图像的负担。这是一种重要的优化 - 因为我们已经有数以百计的图像需要管理，而维护不同的图像集会产生额外的负担。",
    
             multiTouchTitle: "多点触控",
             multiTouchText1: "多点触控支持的实施是该游戏中为数不多的使用到特定于浏览器的代码的地方之一。得益于 Internet Explorer 10 对触控事件监听器的内置支持，实施多点触控是开发中最容易的部分之一。让人高兴的是它们非常有效。对开发人员而言，这是件好事，因为这使得我们可以集中精力应对项目中那些更具有挑战性的部分。以下是与触控事件监听器相关的代码示例：",
             multiTouchText2: "从编码的角度看，我们花费了一些时间编写主触控模块，该模块包含特定于浏览器的触控支持和触控事件处理。该模块跟踪触控事件（无论何种浏览器平台）并将其送入游戏引擎进行处理。此外，游戏元素可“订阅”特定的触控实例以通过触控的“开始触控”来接收通知，并且移动和结束触控事件生命周期。这使得游戏中场景等元素能够轻松地跨浏览器平台对触控事件作出响应。",
    
             downloadTitle1: "您是开发人员吗？",
             helpMessage2: "请点击此处下载 Html5 游戏包",
             downloadText1: "如果您是一位对创建网页游戏感兴趣的网页开发人员，我们为您整理了<br/>一套<a href='downloads/HTML5GameKit.zip'>初用者框架</a>，您可以立即使用该框架来创建 HTML5 游戏。",
             downloadText2: "该范例采用与我们创建 Contre Jour 游戏循环时相同的模式，它将会帮助您开始编写 HTML5 游戏。该范例包含用于创建游戏循环、初用者游戏对象和绘图至画布的代码的简单模式，模式中所有内容设置就绪。相关代码记录齐全。通过这些代码，您可以了解到创建一个基本游戏所需的步骤。此外，您还可以查看以下其他的开发人员资源：",
             downloadText3: "<a href='https://github.com/InternetExplorer'>Internet Explorer GitHub 知识库</a> - 适用于中级到高级用户。GitHub 知识库收集了我们在过去的几个月做出的大量成果，包括与 <a href='http://www.atari.com/arcade' target='_blank'>Atari 合作创建的游戏、<a/> 和 <a href='http://www.cuttherope.ie/' target='_blank'>Cut The Rope（“割绳子”游戏）</a>以及<a href='http://www.justafriend.ie/' target='_blank'> Jasmine Villegas 的互动音乐视频的开发。</a>",
             //   	    downloadText4 : "<a href='#'>Microsoft Developer Network</a> - For web developers of all levels, check out the Microsoft Developer Network site for Internet Explorer where you can learn everything you need to know about building for next generation browsers, getting your site touch-ready, and more!",
    
             conclusionTitle1: "我们由此得到的启示是什么？",
             conclusionText1: "Contre Jour 网页游戏的成功至少证明了 HTML5 浏览器游戏与原生平台游戏间的界限正变得模糊。尽管与浏览器游戏相比，原生游戏在丰富性方面仍占据优势，但浏览器游戏追赶这一优势的潜力极具吸引力。在 Windows 8、Internet Explorer 10 等技术的持续推动下，HTML5 游戏的未来将会更加光明。作为开发人员，我们相信我们可以改变人们对网页潜力的期望值。我们希望 Contre Jour 能启发游戏社区超越极限，探索未知的可能性。您是如何看待这种可能性呢？",
    
             screenshotLink1Text: "某些游戏元素，例如菜单，会使用 DOM元素和 CSS 动画来加速硬件性 能。这有助于将部分渲染工作从 HTML5 画布分担到DOM 和 CSS 布局引擎。",
             screenshotLink2Text: "某些游戏元素，例如菜单，会使用 DOM元素和 CSS 动画来加速硬件性 能。这有助于将部分渲染工作从 HTML5 画布分担到DOM 和 CSS 布局引擎。"
         }
    };
    
    // look first for a query parameter
    var lang = getQueryString('lang');
    
    // if no query parameter, then detect the current language
    if (!lang) {
         lang = window.navigator['language'] ||
                window.navigator['userLanguage'] ||
                window.navigator['browserLanguage'] ||
                window.navigator['systemLanguage'] ||
                "en-us";
         lang = lang.substr(0, 2);
    }
    
    // fallback to english
    if (!(lang in this.localizedStrings)) lang = 'en';
    
    // get the strings
    var Text = this.localizedStrings[lang];    
    
    // save them where we can find them
    $.Text = Text;    
    

}(jQuery));