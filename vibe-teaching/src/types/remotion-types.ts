export type RemotionObjectBase = {
	class: string;
	durationInFrames: number;
};

export type Scene = {
	type: "scene";
	desc: string;
	children: (Title | Heading | Paragraph | Image)[];
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
};

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
	type: "audio";
	durationInFrames: number;
};

export type RemotionObject = Title | Heading | Paragraph | Image;
