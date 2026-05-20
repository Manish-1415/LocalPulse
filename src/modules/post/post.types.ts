

export interface CreatePostView {
    title : string;
    body : string;
    category : "road"| "safety" | "event" | "civic" | "noise" | "other";
    images : {
        url : string;
        public_id : string;
    }[];
    location : {
        type : "Point";
        coordinates : number[];
    };
    city : string;
    status : "open" | "resolved" | "removed";
    tags : string[];
}


export interface UpdatePostView {
    title? : string | undefined;
    body? : string | undefined;
    category? : "road" | "safety" | "event" | "civic" | "noise" | "other" | undefined;
    images? : {
        url : string;
        public_id : string;
    }[] | undefined;
    city? : string | undefined;
    status? : "open" | "resolved" | "removed" | undefined;
    tags? : string[] | undefined;
}


export type QueryView = {
    status : string,
    city : string
    lastId? : string,
}


export type PostStatus = {
    status : "resolved" | "removed";
}


// export type FetchPostsView = {
//     lng : number;
//     lat : number;
//     radius : number;
//     category? : "road" | "safety" | "event" | "civic" | "noise" | "other" | undefined;
//     lastId? : string;
//     sort : "recent" | "trending";
// }


// export type GeoQuery = {
//   status: string;
//   location: {
//     $geoWithin: {
//       $centerSphere: [number[], number];
//     };
//   };
//   category?: string; // Optional property
//   _id?: { $lt: string }; // Optional property (change string to ObjectId if using MongoDB types)
// };