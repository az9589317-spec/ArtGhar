'use server';

/**
 * @fileOverview A flow to generate an artist bio using Genkit.
 *
 * - generateArtistBio - A function that generates an artist bio.
 * - GenerateArtistBioInput - The input type for the generateArtistBio function.
 * - GenerateArtistBioOutput - The return type for the generateArtistBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArtistBioInputSchema = z.object({
  artistName: z.string().describe('The name of the artist.'),
  productCategories: z
    .string()
    .describe('The categories of products the artist sells, comma separated.'),
  pastSalesDescription: z
    .string()
    .optional()
    .describe('A description of past sales or achievements, if any.'),
});
export type GenerateArtistBioInput = z.infer<typeof GenerateArtistBioInputSchema>;

const GenerateArtistBioOutputSchema = z.object({
  bio: z.string().describe('The generated artist bio.'),
});
export type GenerateArtistBioOutput = z.infer<typeof GenerateArtistBioOutputSchema>;

export async function generateArtistBio(input: GenerateArtistBioInput): Promise<GenerateArtistBioOutput> {
  return generateArtistBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArtistBioPrompt',
  input: {schema: GenerateArtistBioInputSchema},
  output: {schema: GenerateArtistBioOutputSchema},
  prompt: `You are a creative copywriter specializing in artist biographies for e-commerce platforms.

  Based on the information provided, craft a compelling and engaging "About Me" section for the artist's profile.
  The bio should be concise, highlighting the artist's name, the type of products they create, and any notable achievements or past sales.
  Aim for a warm and inviting tone that encourages customers to connect with the artist and their work.

  Artist Name: {{{artistName}}}
  Product Categories: {{{productCategories}}}
  Past Sales Description: {{{pastSalesDescription}}}

  About Me:`,
});

const generateArtistBioFlow = ai.defineFlow(
  {
    name: 'generateArtistBioFlow',
    inputSchema: GenerateArtistBioInputSchema,
    outputSchema: GenerateArtistBioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
