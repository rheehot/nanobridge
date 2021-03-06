<template>
	<section class="Post" :id="`post-${post.postId}`">
		<img class="Post__profile" :src="user.profile" :alt="user.username">
		<div class="Post__column">
			<div class="Post__author">
				<nuxt-link :to="`/user/${user.loginName}`" class="Post__username">
					{{user.username}}
				</nuxt-link>

				<span class="Post__loginname">
					@{{user.loginName}}
				</span>

				<span class="Post__divider">
					/
				</span>

				<time class="Post__date" :datetime="toIsoTime(post.createdAt)">{{toReadable(post.createdAt)}}</time>
			</div>

			<div v-if="post.replyTo !== undefined">
				<div class="Post__reply Reply">
					<i class="Reply__icon mdi mdi-reply"></i>
					<div class="Reply__content">
						<template v-if="post.replyTo === null">
							삭제된 글
						</template>
						<template v-else>
							ASDF
							<!-- TODO add showing reply -->
						</template>
					</div>
				</div>
			</div>

			<div class="Post__content-wrapper" :style="{'max-height': expansionHeight}">
				<div class="Post__content Markdown" v-html="post.content" ref="content"></div>
				<div class="Post__content__more" v-if="textCropped">
					<a @click="showMore">
						<i class="mdi mdi-arrow-down"></i>
						이 글을 더 읽기
					</a>
				</div>
			</div>

			<div class="Post__images"
				:class="[`Post__images--${pickingImage}`, {'Post__images--plus': leftImage > 0}]"
				v-if="post.images.length > 0">

				<a v-for="i in pickingImage"
					:key="post.images[i - 1].id"
					:data-left="leftImage"
					@click="showImage(i)">

					<img :src="`/static_post/${post.postId}/${post.images[i - 1].file}`">
				</a>
			</div>
		</div>
	</section>
</template>

<style lang="less" scoped>
	.Post {
		display: flex;
		margin: 30px;
		margin-bottom: 48px;
		width: 100%;

		color: #d0d0d0;
		font-family: 'Noto Sans CJK KR', sans-serif;
		overflow: hidden;

		&__profile {
			width: 64px;
			height: 64px;
			border-radius: 50%;
			object-fit: cover;
		}

		&__column {
			padding-left: 16px;
			flex: 1;
		}

		&__content-wrapper {
			max-height: 400px;
			margin: 12px 0;
			overflow: hidden;
			position: relative;
			transition: all .4s ease;
		}

		&__content {
			&__more {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;

				display: flex;
				align-items: center;
				justify-content: center;

				background: linear-gradient(to bottom, transparent 0%, rgba(22, 22, 22, 1) 75%);
				height: 60px;

				.mdi {
					margin-right: 5px;
				}

				a {
					color: #d0d0d0;
					font-family: 'Noto Sans CJK KR', sans-serif;
					font-size: .8rem;
					font-weight: 800;
					text-decoration: none;

					cursor: pointer;
					transition: all .4s ease;

					&:hover {
						color: #00bcd4;
					}
				}
			}
		}

		&__username {
			font-size: 1.2rem;
			color: #4dd0e1;
			text-decoration: none;
		}

		&__loginname {
			font-size: 0.8rem;
			color: #a1a2a3;
		}

		&__date {
			font-size: 0.8rem;
			color: #a1a2a3;
		}

		&__images {
			display: grid;
			width: 100%;
			height: 500px;
			border-radius: 10px;
			overflow: hidden;

			grid-template-columns: repeat(5, 1fr);
			grid-template-rows: repeat(6, 1fr);
			grid-column-gap: 5px;
			grid-row-gap: 5px;

			&--1 {
				grid-template-areas:
					'pic1 pic1 pic1 pic1 pic1'
					'pic1 pic1 pic1 pic1 pic1'
					'pic1 pic1 pic1 pic1 pic1'
					'pic1 pic1 pic1 pic1 pic1'
					'pic1 pic1 pic1 pic1 pic1'
					'pic1 pic1 pic1 pic1 pic1';
			}

			&--2 {
				grid-template-areas:
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic2 pic2';
			}

			&--3 {
				grid-template-areas:
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic2 pic2'
					'pic1 pic1 pic1 pic3 pic3'
					'pic1 pic1 pic1 pic3 pic3';
			}

			&--4 {
				grid-template-areas:
					'pic1 pic1 pic1 pic3 pic3'
					'pic1 pic1 pic1 pic3 pic3'
					'pic1 pic1 pic1 pic3 pic3'
					'pic2 pic2 pic2 pic3 pic3'
					'pic2 pic2 pic2 pic4 pic4'
					'pic2 pic2 pic2 pic4 pic4';
			}

			&--5 {
				grid-template-areas:
					'pic1 pic1 pic1 pic3 pic3'
					'pic1 pic1 pic1 pic3 pic3'
					'pic1 pic1 pic1 pic4 pic4'
					'pic2 pic2 pic2 pic4 pic4'
					'pic2 pic2 pic2 pic5 pic5'
					'pic2 pic2 pic2 pic5 pic5';
			}

			&--plus :nth-child(5) {
				position: relative;
				overflow: hidden;

				img {
					margin-top: -3px;
					margin-left: -3px;
					width: ~"calc(100% + 6px)";
					height: ~"calc(100% + 6px)";

					filter: blur(3px);
				}

				&::after {
					content: '+' attr(data-left);

					display: flex;
					align-items: center;
					justify-content: center;

					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;

					color: rgba(255, 255, 255, .6);
					font-family: 'Noto Sans CJK KR', sans-serif;
					font-weight: 700;
					font-size: 4rem;

					background: rgba(0, 0, 0, .8);
				}
			}

			& > a {
				background: #303030;
				cursor: pointer;
			}

			:nth-child(1) {
				grid-area: pic1;
			}

			:nth-child(2) {
				grid-area: pic2;
			}

			:nth-child(3) {
				grid-area: pic3;
			}

			:nth-child(4) {
				grid-area: pic4;
			}

			:nth-child(5) {
				grid-area: pic5;
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}

	.Reply {
		display: flex;
		align-items: center;

		border-left: 3px solid #404040;
		margin-left: 16px;
		height: 64px;

		&__icon {
			font-size: 1.3rem;
			padding: 0 16px;
		}
	}
</style>

<style lang="less">
	.Markdown {
		mark {
			background: #4dd0e1;
			color: #202020;
			padding: 0 3px;
		}

		code {
			background: #303030;
			color: #d0d0d0;
			font-family: 'Fira Code', 'D2Coding', monospace;
			margin: 0 3px;
			padding: 2px 5px;
			border-radius: 3px;
		}

		& > p:first-child {
			margin-top: 0;
		}

		& > p:last-child {
			margin-bottom: 0;
		}
	}
</style>

<script>
	import moment from 'moment';
	moment.locale('ko');

	export default {
		data() {
			return {
				contentHeight: 400,
				expansion: false
			};
		},

		props: {
			post: {
				type: Object,
				required: true
			},

			user: {
				type: Object,
				required: true
			}
		},

		computed: {
			totalImage() {
				return this.post.images.length;
			},

			pickingImage() {
				return Math.min(this.totalImage, 5);
			},

			leftImage() {
				return this.totalImage - this.pickingImage;
			},

			textCropped() {
				return this.contentHeight > 400 && !this.expansion;
			},

			expansionHeight() {
				return `${this.expansion ? this.contentHeight : 400}px`;
			}
		},

		methods: {
			toIsoTime(unix) {
				return new Date(unix).toISOString();
			},

			toReadable(unix) {
				const current = moment();
				const date = moment(unix);
				const dateAfterWeek = date.clone().add(7, 'days');

				if(current.isAfter(dateAfterWeek, 'day')) {
					return date.format('LL');
				}

				if(!current.isSame(date, 'day')) {
					return date.format('dddd');
				}

				return current.to(date);
			},

			showImage(img) {

			},

			showMore() {
				this.expansion = true;
			}
		},

		mounted() {
			const {height: contentHeight} = this.$refs.content.getBoundingClientRect();
			this.contentHeight = contentHeight;
		}
	};
</script>
