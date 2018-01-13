/* eslint-disable */
import axios from 'axios'

export function getPosts (data,countData) {
    let posts = [];
    data.hits.hits.forEach(function(element) {
        let post = getPostFromEl(element, countData.sourceShortName);
        posts.push(post);
    }, this);
    return posts;
}

function getPostFromEl(element, source){
    let post ={}
    if(source == 'facebook-live'){
        post.name = element._source.video_name;
        post.type = 'facebook live';
        post.text = element._source.video_message;
        post.owner = element._source.video_owner;
        post.time = element._source.record_time
    }else{
        post.name = element._source.text;
        post.type = 'facebook hashtag';
        post.text = element._source.post_content;
        post.owner = element._source.author.name;
        post.time = element._source.record_time
    }
    return post;
    }
