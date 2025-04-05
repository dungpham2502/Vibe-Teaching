export type RemotionObjectBase = {
	id: string;
	class: string;
	durationInFrames: number;
};

export type Scene = {
	type: "scene";
	desc: string;
	children: RemotionObject[];
} & RemotionObjectBase;

// <title></title>
export type Title = {
	type: "title";
	text: string;
} & RemotionObjectBase;

// <subtitle></subtitle>
export type SubTitle = {
	type: "subtitle";
	text: string;
} & RemotionObjectBase;

// <heading></heading>
export type Heading = {
	type: "heading";
	text: string;
} & RemotionObjectBase;

// <para></para>
export type Paragraph = {
	type: "paragraph";
	text: string;
} & RemotionObjectBase;

// <img src="/"/>
export type Image = {
	type: "image";
	src: string;
} & RemotionObjectBase;

// <video src="/"/>
export type Video = {
	type: "video";
	src: string;
} & RemotionObjectBase;

// <audio src="/"/>
export type Audio = {
	id: string;
	type: "audio";
	class: string;
	durationInFrames: number;
};

export type RemotionObject =
	| Title
	| SubTitle
	| Heading
	| Paragraph
	| Image
	| Video
	| Audio;
