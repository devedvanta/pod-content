/**
 * Rain of Posts component.
 *
 * Creates a spawner on the scene, which periodically generates new posts
 * and drops them from the sky. Objects falling below altitude=0 will be
 * recycled after a few seconds.
 *
 * Requires: physics
 */
AFRAME.registerComponent('rain-of-posts', {
    schema: {
        tagName: { default: 'a-box' },
        components: { default: ['dynamic-body', 'force-pushable', 'height|2'] },
        spread: { default: 10, min: 0 },
        maxCount: { default: 10, min: 0 },
        interval: { default: 1000, min: 0 },
        lifetime: { default: 10000, min: 0 }
    },
    init: async function () {
        this.boxes = [];
        this.ig_data = await this.getDataFromInstagram();
        this.timeout = setInterval(this.spawn.bind(this), this.data.interval);
    },
    spawn: function () {
        if (this.boxes.length >= this.data.maxCount) {
            clearTimeout(this.timeout);
            return;
        }

        var data = this.data,
            physics = this.el.sceneEl.systems.physics,
            box = document.createElement(data.tagName);

        this.boxes.push(box);
        this.el.appendChild(box);

        box.setAttribute('position', this.randomPosition());

        var randomMedia = this.randomMedia();
        box.setAttribute('src', randomMedia.display_url);
        box.setAttribute('width', (randomMedia.dimensions.width / 1000) * 2);
        box.setAttribute('height', (randomMedia.dimensions.height / 1000) * 2);
        box.setAttribute('rotation', this.randomRotation());
        data.components.forEach(function (s) {
            var parts = s.split('|');
            box.setAttribute(parts[0], parts[1] || '');
        });

        // Recycling is important, kids.
        setInterval(function () {
            if (box.body.position.y > 0) return;
            box.body.position.copy(this.randomPosition());
            box.body.quaternion.set(0, 0, 0, 1);
            box.body.velocity.set(0, 0, 0);
            box.body.angularVelocity.set(0, 0, 0);
            var randomMedia = this.randomMedia();
            box.setAttribute('src', randomMedia.display_url);
            box.setAttribute('width', (randomMedia.dimensions.width / 1000) * 2);
            box.setAttribute('height', (randomMedia.dimensions.height / 1000) * 2);
            // box.body.updateProperties();
        }.bind(this), this.data.lifetime);

        var colliderEls = this.el.sceneEl.querySelectorAll('[sphere-collider]');
        for (var i = 0; i < colliderEls.length; i++) {
            colliderEls[i].components['sphere-collider'].update();
        }
    },
    randomPosition: function () {
        var spread = this.data.spread;
        return {
            x: -1 + Math.random() * spread - spread / 2,
            y: 10,
            z: -3 + Math.random() * spread - spread / 2,
        };
    },
    randomMedia: function () {
        var maxCount = this.ig_data.Medias.count < 50 ? this.ig_data.Medias.count : 50;
        var randomNumber = Math.floor(Math.random() * (maxCount + 1));
        console.log(this.ig_data.Medias[randomNumber], randomNumber);
        // var media = this.ig_data.Medias.edges[randomNumber].node.display_url;
        return this.ig_data.Medias.edges[randomNumber].node;
    },
    randomRotation: function () {
        var randomNumber = Math.floor(Math.random() * (180));
        console.log(randomNumber);
        return `0 ${randomNumber} 0`;
    },
    getDataFromInstagram: async function () {
        //  let username = 'karx01';
        let params = (new URL(document.location)).searchParams;
        let username = params.get("handle") || 'karx01';
        // return new Promise((resolve, reject) => {
        //   resolve({
        //     Account: pp.graphql.user,
        //     Medias: mm.data.user.edge_owner_to_timeline_media
        //   });
        // });
        return new Promise((resolve, reject) => {
            fetch("https://www.instagram.com/" + username + "/?__a=1")
                .then(account => account.json())
                .then(accountJson => {
                    fetch(
                        "https://www.instagram.com/graphql/query/?query_id=17888483320059182" +
                        "&id=" +
                        accountJson.graphql.user.id +
                        "&first=" +
                        50
                    )
                        .then(account_media => account_media.json())
                        .then(account_mediaJson => {
                            //Get Medias
                            var Result = {};

                            //Prepare data to return
                            Result.Account = accountJson.graphql.user;
                            Result.Medias =
                                account_mediaJson.data.user.edge_owner_to_timeline_media;
                            console.log(Result);

                            return resolve(Result);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        });

    }
});