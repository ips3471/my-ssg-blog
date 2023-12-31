import PostType from '@/interfaces/post';
import { PostPresenter } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import Link from 'next/link';

type Props = {
	post: PostType;
};

export default function Post({ post }: Props) {
	return (
		<div className='layout'>
			<header className='py-2'>
				<nav>
					<Link className='text-blue-500 text-xl' href={'/'}>
						Home
					</Link>
				</nav>
			</header>
			<div dangerouslySetInnerHTML={{ __html: post.content }} />
		</div>
	);
}

type Params = {
	params: {
		slug: string;
	};
};

export async function getStaticProps({ params }: Params) {
	const presenter = new PostPresenter();
	const fields = ['title', 'date', 'content', 'description'];
	const post = presenter.getPostBySlug(fields, params.slug);
	const htmlString = await markdownToHtml(post.content || '');

	return {
		props: {
			post: {
				slug: params.slug,
				content: htmlString,
			},
		},
	};
}

export async function getStaticPaths() {
	const presenter = new PostPresenter();
	const posts = presenter.getAllPosts(['slug']);

	return {
		paths: posts.map(post => {
			return {
				params: {
					slug: post.slug,
				},
			};
		}),
		fallback: false,
	};
}
