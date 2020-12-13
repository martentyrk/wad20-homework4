import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({ routes });

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, { router, store, localVue });

    it('renders correct amount of posts', function () {
        const postsCount = wrapper.findAll('.post')
        expect(postsCount.length).toEqual(testData.length)
    });
});

describe('Media', () => {

    const wrapper = mount(Posts, { router, store, localVue });

    it('renders correct amount of images', () => {
        const imageCount = wrapper.findAll('.post-image > img')
        const testImage = testData.filter(post => post.media && post.media.type == 'image')
        expect(imageCount.length).toEqual(testImage.length)
    })

    it('renders correct amount of videos', () => {
        const videoCount = wrapper.findAll('.post-image > video')
        const testVideo = testData.filter(post => post.media && post.media.type == 'video')
        expect(videoCount.length).toEqual(testVideo.length)
    })
    it('nothing is rendered when media is absent', () => {
        const postsCount = wrapper.findAll('.post')
        const imageCount = wrapper.findAll('.post-image > img')
        const videoCount = wrapper.findAll('.post-image > video')
        const absentMedia = testData.filter(post => !post.media)
        const testAbsentData = postsCount.length - imageCount.length - videoCount.length
        expect(testAbsentData).toEqual(absentMedia.length)
    });
});




describe('Date', () => {
    const wrapper = mount(Posts, { router, store, localVue });
    var moment = require('moment');
    it('create time is displayed in correct format', () => {
        for (let i = 0; i < testData.length; i++) {
            const date = wrapper.find('.post-author > small').text();
            const formatted = moment(testData[i].createTime).format('LLLL');
            expect(date).toEqual(formatted);
        }
    });
});
