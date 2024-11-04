import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { Post, User, Profile, GraphQLMemberTypeId } from './query.js';
import { UUIDType } from './types/uuid.js';
import {
  PostDto,
  PostModel,
  ProfileDto,
  ProfileModel,
  UserDto,
  UserModel,
  Context,
} from './types/models.js';

// Input Types
const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLMemberTypeId) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLMemberTypeId },
  },
});

// Mutations
export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: Post,
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (
        root,
        args: { dto: PostDto },
        context: Context,
      ): Promise<PostModel> => await context.prisma.post.create({ data: args.dto }),
    },
    deletePost: {
      type: new GraphQLNonNull(UUIDType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (root, args: { id: string }, context: Context) => {
        await context.prisma.post.delete({ where: { id: args.id } });
        return args.id;
      },
    },
    changePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (
        root,
        args: { id: string; dto: PostDto },
        context: Context,
      ): Promise<PostModel> =>
        await context.prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        }),
    },

    createUser: {
      type: User,
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (
        root,
        args: { dto: UserDto },
        context: Context,
      ): Promise<UserModel> => await context.prisma.user.create({ data: args.dto }),
    },
    deleteUser: {
      type: new GraphQLNonNull(UUIDType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (root, args: { id: string }, context: Context) => {
        await context.prisma.user.delete({ where: { id: args.id } });
        return args.id;
      },
    },
    changeUser: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (
        root,
        args: { id: string; dto: UserDto },
        context: Context,
      ): Promise<UserModel> =>
        await context.prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        }),
    },

    createProfile: {
      type: Profile,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (
        root,
        args: { dto: ProfileDto },
        context: Context,
      ): Promise<ProfileModel> => await context.prisma.profile.create({ data: args.dto }),
    },
    deleteProfile: {
      type: new GraphQLNonNull(UUIDType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (root, args: { id: string }, context: Context) => {
        await context.prisma.profile.delete({ where: { id: args.id } });
        return args.id;
      },
    },
    changeProfile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (
        root,
        args: { id: string; dto: ProfileDto },
        context: Context,
      ): Promise<ProfileModel> =>
        await context.prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        }),
    },

    subscribeTo: {
      type:  new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        root,
        args: { userId: string; authorId: string },
        context: Context,
      ): Promise<string> => {
        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });

        return args.authorId;
        }
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        root,
        args: { userId: string; authorId: string },
        context: Context,
      ): Promise<string> => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return args.userId;
      },
    },
  },
});
