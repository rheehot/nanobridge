<template>
	<div class="PostListing">
		<editor v-if="acl.includes('postWrite') && ownList" @send="choose(1)"></editor>

		<template v-if="acl.includes('postRead')">
			<div class="Container PostListing__header">
				<div class="PostListing__chooser Chooser">
					<button class="Chooser__item" :class="{'Chooser__chosen': chosen === 1}" @click="choose(1)">
						글
						<span class="Chooser__value" v-if="counts.enabled">
							{{beautifyCount(counts.post)}}
						</span>
					</button>

					<button class="Chooser__item" :class="{'Chooser__chosen': chosen === 2}" @click="choose(2)">
						앨범
						<span class="Chooser__value" v-if="counts.enabled">
							{{beautifyCount(counts.album)}}
						</span>
					</button>

					<div class="Chooser__highlight"></div>
				</div>

				<div class="PostListing__pagination Pagination" v-if="isPageMode">
					<template v-for="(x, i) in paginationItems">
						<span class="Pagination__page Pagination__page--disabled"
							:key="`pagination-${i}`"
							v-if="x === null">

							<i class="mdi mdi-dots-horizontal"></i>
						</span>

						<nuxt-link class="Pagination__page"
							:to="getPageLink(x)"
							:key="`pagination-${i}`"
							v-else>

							{{x}}
						</nuxt-link>
					</template>
				</div>
			</div>

			<div class="PostListing__list">
				<transition name="Fade">
					<div class="PostListing__articles" v-if="!isAlbum">
						<template v-for="(postsInPage, index) in postsAppend">
							<div class="PostListing__wrapper Container" v-for="post in postsInPage">
								<post :key="`${post.postId}-post`" :post="post" :user="usersAppend[post.author]"></post>
							</div>

							<listing-split
								v-if="getPageByIndex(index) !== paginationAppend.max"
								:link="getPageLink(getPageByIndex(index + 1))"
								:page="getPageByIndex(index)"
								:max="paginationAppend.max"
								@navigate="scrollTop">
							</listing-split>
						</template>
					</div>

					<div class="PostListing__album" v-else>
						<template v-for="(postsInPage, index) in postsAppend">
							<div class="PostListing__albumPage Container">
								<post-album
									:key="`${post.postId}-post`"
									:post="post"
									v-for="post in postsInPage">
								</post-album>
							</div>

							<listing-split
								v-if="getPageByIndex(index) !== paginationAppend.max"
								:link="getPageLink(getPageByIndex(index + 1))"
								:page="getPageByIndex(index)"
								:max="paginationAppend.max"
								@navigate="scrollTop">
							</listing-split>
						</template>
					</div>
				</transition>

				<transition name="Fade">
					<div class="PostListing__empty" v-if="postsAppend.length === 0">
						<span v-if="acl.includes('postWrite') && ownList">
							어서 첫번째 글을 작성해보세요!
						</span>
						<span v-else>
							아직 아무런 글도 없네요. 나중에 다시 확인해보세요!
						</span>
					</div>
				</transition>

				<pagination-trigger
					ref="trigger"
					:next="paginationAppend.current < paginationAppend.max"
					:load-next="loadNext">
				</pagination-trigger>
			</div>
		</template>
		<template v-else>
			<div class="PostListing__noperm Container">
				<i class="PostListing__noperm__icon mdi mdi-alert-outline"></i>
				<div class="PostListing__noperm__text">
					글들을 보시려면 로그인 / 회원가입을 해주세요!
				</div>
			</div>
		</template>
	</div>
</template>

<style lang="less" scoped>
	.PostListing {
		padding: 50px 0;

		&__header {
			display: flex;
			justify-content: space-between;
		}

		&__chooser {
			width: 200px;
			height: 32px;
			border-radius: 16px;

			background: #202020;
		}

		&__noperm {
			background: #202020;
			padding: 80px 0;
			color: #909090;
			text-align: center;
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-size: 1.5rem;
			font-weight: 700;

			&__icon {
				color: #0097a7;
				font-size: 5rem;
			}
		}

		&__split {
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-size: 0.8rem;
			font-weight: 700;

			border-top: 3px dashed #212121;
			height: 20px;
			position: relative;

			&__wrapper {
				display: flex;
				justify-content: flex-end;
				line-height: 1.2rem;
				transform: translate(0, -0.6rem);
			}

			&__text {
				color: #d0d0d0;
				text-decoration: none;

				background: #161616;
				padding: 0 10px;
				transition: all .4s ease;

				&:hover {
					color: #00bcd4;
				}
			}

			&__indicator {
				position: absolute;
				right: 50px;
				top: -7rem;
				line-height: 6.2rem;
				font-size: 5rem;
				font-weight: 100;
				font-family: "Noto Sans CJK KR", sans-serif;
				color: #2a2a2a;
			}
		}

		&__list {
			display: flex;
			flex-direction: column;
			align-items: stretch;
		}

		&__wrapper {
			display: flex;

			& > * {
				flex: 1;
			}
		}

		&__albumPage {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			&::after {
				content: "";
				flex: auto;
			}
		}

		&__empty {
			color: #606060;
			text-align: center;
			font-size: 4rem;
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-weight: 100;

			margin-top: 100px;
		}
	}

	.PostAlbum {
		margin: 20px;
	}

	.Chooser {
		display: flex;
		align-items: stretch;
		position: relative;

		&__item {
			position: relative;
			z-index: 2;

			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;

			color: #d0d0d0;
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-size: .8rem;

			background: transparent;
			border: none;
			outline: none;
			transition: all .4s ease;

			&.Chooser__chosen {
				color: #202020;
			}

			&:not(.Chooser__chosen) {
				cursor: pointer;
			}
		}

		&__value {
			margin-left: 10px;
			font-size: .6rem;
		}

		&__highlight {
			width: 50%;
			height: 32px;
			border-radius: 16px;
			position: absolute;

			background: #d0d0d0;
			transition: all .4s ease;
		}

		&__chosen:nth-child(1) ~ &__highlight {
			left: 0;
		}

		&__chosen:nth-child(2) ~ &__highlight {
			left: 50%;
		}
	}

	.Pagination {
		display: flex;

		&__page {
			text-align: center;
			line-height: 32px;

			width: 32px;
			height: 32px;
			background: #202020;

			color: #d0d0d0;
			border-radius: 50%;
			transition: all .4s ease;

			font-family: 'Titillium Web', sans-serif;
			font-size: .8rem;
			font-weight: 700;
			text-decoration: none;

			&:not(:last-child) {
				margin-right: 10px;
			}

			&.nuxt-link-exact-active {
				background: #d0d0d0;
				color: #202020;
			}
		}
	}

	@media (max-width: 1280px) {
		.PostListing__split__indicator {
			display: none;
		}
	}
</style>

<script>
	import Editor from "./Editor.vue";
	import ListingSplit from "./ListingSplit.vue";
	import PaginationTrigger from "./PaginationTrigger.vue";
	import Post from "./Post.vue";
	import PostAlbum from "./PostAlbum.vue";

	import prefix from "../assets/js/prefix";
	import scrollTo from "../assets/js/scrollTo";

	export default {
		data() {
			return {
				chosen: 1,
				additionalPosts: [],
				additionalUsers: {},
				updatedPagination: null,
				scrollWhenPageChange: false
			};
		},

		props: {
			context: {
				type: String,
				default: '/'
			},

			apiContext: {
				type: String,
				default: '/api/post'
			},

			posts: {
				type: Array
			},

			users: {
				type: Object
			},

			counts: {
				type: Object
			},

			pagination: {
				type: Object,
				default: {
					current: 1,
					max: 1,
					perPage: 25
				}
			},

			ownList: Boolean
		},

		computed: {
			acl() {
				return this.$store.state.auth.acl;
			},

			isAlbum() {
				return this.chosen === 2;
			},

			isPageMode() {
				return !!this.$route.query.page;
			},

			usersAppend() {
				if(this.isAlbum) return this.additionalUsers;
				return Object.assign({}, this.users, this.additionalUsers);
			},

			postsAppend() {
				if(this.isAlbum) return this.additionalPosts;
				return [this.posts].concat(this.additionalPosts);
			},

			paginationAppend() {
				return this.updatedPagination || this.pagination;
			},

			paginationItems() {
				let items = [];

				const min = 1;
				const current = this.paginationAppend.current;
				const max = this.paginationAppend.max;

				if(current - 3 > min + 1) {
					items.push(min, null);
				}

				for(let i = Math.max(min, current - 2); i <= Math.min(current + 2, max); i++) {
					items.push(i);
				}

				if(current + 2 < max - 1) {
					items.push(null, max);
				}

				return items;
			},

			apiContextAppend() {
				if(this.isAlbum) return `${this.apiContext}?album=1&`;
				return `${this.apiContext}?album=0&`
			}
		},

		methods: {
			async choose(i) {
				this.chosen = i;
				this.additionalPosts = [];
				this.updatedPagination = null;

				if(this.isAlbum) {
					await this.loadNext(1);
					this.$emit('pagination', this.updatedPagination);
					//TODO fix bug when choosing album on 2 or higher page
				}

				this.$nextTick(() => {
					this.$refs.trigger.refresh();
				});
			},

			getPageByIndex(index) {
				return index + this.pagination.current;
			},

			getPageLink(page) {
				return `${this.context}?page=${page}`;
			},

			async loadNext(page = null) {
				const nextPage = page === null ? this.paginationAppend.current + 1 : page;
				const newPage = await this.$axios.$get(`${this.apiContextAppend}page=${nextPage}`);

				if(newPage.posts.length !== 0) {
					this.additionalPosts.push(newPage.posts);
				}
				this.additionalUsers = Object.assign({}, this.additionalUsers, newPage.users);
				this.updatedPagination = newPage.pagination;
			},

			refresh() {
				this.additionalPosts = [];
				this.updatedPagination = null;

				this.$nextTick(() => {
					this.$refs.trigger.refresh();
				});
			},

			scrollTop() {
				this.scrollWhenPageChange = true;
			},

			beautifyCount(i) {
				return prefix(i);
			}
		},

		watch: {
			'$route.query.page'() {
				if(this.scrollWhenPageChange) {
					this.$nextTick(() => {
						scrollTo(window.innerHeight * 0.6);
					});

					this.scrollWhenPageChange = false;
				}
			}
		},

		components: {
			Editor,
			ListingSplit,
			PaginationTrigger,
			Post,
			PostAlbum
		}
	}
</script>
