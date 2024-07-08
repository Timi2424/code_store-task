import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import axios from 'axios';
import { Movie } from 'src/types/movie.interface';


@Injectable()
export class PdfService {

    async generatePopularMoviesPdf(movies: Movie[]): Promise<Buffer> {
        const baseRedirectUrl = `/movies`;
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        const FONT_SIZE = 12;
        const MARGIN = 40;

        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        let yPosition = height - MARGIN;

        const fontHeight = timesRomanFont.heightAtSize(FONT_SIZE)

        for (const movie of movies) {
            if (yPosition < MARGIN) {
                page = pdfDoc.addPage();
                yPosition = height - MARGIN;
            }

            const titleText = `${movie.title}`;
            const releaseDateText = `Release Date: ${movie.release_date}`;
            const voteAverageText = `Vote Average: ${movie.vote_average}`;
            const linkText = `${baseRedirectUrl}/${movie.id}`;

             const linkAnnotation = page.doc.context.register(
                page.doc.context.obj({
                    Type: 'Annot',
                    Subtype: 'Link',
                    Rect: [MARGIN, yPosition + FONT_SIZE, width - 2 * MARGIN, 2],
                    A: {
                        Type: 'Action',
                        S: 'URI',
                        URI: linkText,
                    },
                })
            );
        
            page.node.addAnnot(linkAnnotation);

            page.drawText(titleText, {
                x: MARGIN,
                y: yPosition,
                size: FONT_SIZE,
                font: timesRomanFont,
                color: rgb(0, 0, 1),
            });

            page.drawText(releaseDateText, {
                x: MARGIN,
                y: yPosition - fontHeight - 5,
                size: FONT_SIZE,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            page.drawText(voteAverageText, {
                x: MARGIN,
                y: yPosition - fontHeight * 2 - 10,
                size: FONT_SIZE,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            yPosition -= fontHeight * 3 + MARGIN;
        }

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }

    async generateMovieDetailsPdf(movie: Movie): Promise<Buffer> {
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        
        const FONT_SIZE = 12;
        const MARGIN = 40;

        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        let yPosition = height - MARGIN;

        const fontHeight = timesRomanFont.heightAtSize(FONT_SIZE)

        const movieDetails = `${movie.title}\nRelease Date: ${movie.release_date}\nVote Average: ${movie.vote_average}\n\n`;
        page.drawText(movieDetails, {
            x: MARGIN,
            y: yPosition,
            size: FONT_SIZE,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        yPosition -= fontHeight + MARGIN;

        if (movie.poster_path) {
            const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            const response = await axios.get(posterUrl, { responseType: 'arraybuffer' });
            const posterImage = await pdfDoc.embedJpg(response.data);

            const posterWidth = 200;
            const posterHeight = 300;
            page.drawImage(posterImage, {
                x: MARGIN,
                y: yPosition - posterHeight - 20,
                width: posterWidth,
                height: posterHeight,
            });
        }
 

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
}
