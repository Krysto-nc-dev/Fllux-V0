import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/server'; // Assurez-vous que le chemin est correct

const f = createUploadthing();

const authenticateUser = async (req, res) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');
    console.log('Authenticated user ID:', userId);
    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return { userId };
  } catch (error) {
    console.error('Error in authenticateUser:', error);
    throw error;
  }
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  subaccountLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for subaccountLogo:', { metadata, file });
    }),
  avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for avatar:', { metadata, file });
    }),
  agencyLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for agencyLogo:', { metadata, file });
    }),
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for media:', { metadata, file });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
