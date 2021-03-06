/*global define */
define(['jquery', 'underscore', 'easel', 'model/planet'], function ($, _, createjs, PlanetModel) {
    'use strict';
    var ObstacleGenerator,
        instance,
        planets;

    planets = [
        {
            generate: function () {
                return new createjs.Bitmap('build/images/planets/0.png');
            },
            velocity: 1.5,
            chance: 0.1
        },
        {
            generate: function () {
                return new createjs.Bitmap('build/images/planets/1.png');
            },
            velocity: 1,
            chance: 0.1
        },
        {
            generate: function () {
                return new createjs.Bitmap('build/images/planets/2.png');
            },
            velocity: 1,
            chance: 0.1
        }
    ];

    ObstacleGenerator = function (data) {
        var that = this;

        this.threshhold = 0;
        this.state = data.state;
        this.weights = [];
        this.startTime = new Date();

        _.each(planets, function (v) {
            that.weights.push(v.chance);
        });

        createjs.Ticker.addEventListener('tick', this.tick);
    };

    ObstacleGenerator.prototype.clear = function () {
        createjs.Ticker.removeEventListener('tick', this.tick);
    };

    ObstacleGenerator.prototype.rand = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    ObstacleGenerator.prototype.getRandomItem = function (list, weight) {
        var total_weight = weight.reduce(function (prev, cur) {
                return prev + cur;
            }), random_num = this.rand(0, total_weight),
            weight_sum = 0,
            i;

        for (i = 0; i < list.length; i++) {
            weight_sum += weight[i];
            weight_sum = +weight_sum.toFixed(2);

            if (random_num <= weight_sum) {
                return list[i];
            }
        }

        return list[0];
    };

    ObstacleGenerator.prototype.tick = function (e) {
        var item,
            thing;

        instance.threshhold -= e.delta / 200;

        if (instance.threshhold < 0) {
            instance.threshhold = Math.random() * 500;

            item = instance.getRandomItem(planets, instance.weights);
            thing = item.generate();
            new PlanetModel({
                object: thing,
                velocity: item.velocity * instance.rand(80, 100) / 100,
                states: instance.state
            });
            instance.state.addChild(thing);
        }
    };


    return function (data) {
        return (function () {
            instance = new ObstacleGenerator(data);
            return instance;
        }());
    };
});
