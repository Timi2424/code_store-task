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

        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
        const margin = 40;
        let yPosition = height - margin;

        const fontHeight = timesRomanFont.heightAtSize(fontSize)

        for (const movie of movies) {
            if (yPosition < margin) {
                page = pdfDoc.addPage();
                yPosition = height - margin;
            }

            const titleText = `${movie.title}`;
            const releaseDateText = `Release Date: ${movie.release_date}`;
            const voteAverageText = `Vote Average: ${movie.vote_average}`;
            const linkText = `${baseRedirectUrl}/${movie.id}`;

             const linkAnnotation = page.doc.context.register(
                page.doc.context.obj({
                    Type: 'Annot',
                    Subtype: 'Link',
                    Rect: [margin, yPosition + fontSize, width - 2 * margin, 2],
                    A: {
                        Type: 'Action',
                        S: 'URI',
                        URI: linkText,
                    },
                })
            );
        
            page.node.addAnnot(linkAnnotation);

            page.drawText(titleText, {
                x: margin,
                y: yPosition,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 1),
            });

            page.drawText(releaseDateText, {
                x: margin,
                y: yPosition - fontHeight - 5,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            page.drawText(voteAverageText, {
                x: margin,
                y: yPosition - fontHeight * 2 - 10,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            yPosition -= fontHeight * 3 + margin;
        }

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }

    async generateMovieDetailsPdf(movie: Movie): Promise<Buffer> {
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
        const margin = 40;
        let yPosition = height - margin;

        const fontHeight = timesRomanFont.heightAtSize(fontSize)

        const movieDetails = `${movie.title}\nRelease Date: ${movie.release_date}\nVote Average: ${movie.vote_average}\n\n`;
        page.drawText(movieDetails, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        yPosition -= fontHeight + margin;

        if (movie.poster_path) {
            const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            const response = await axios.get(posterUrl, { responseType: 'arraybuffer' });
            const posterImage = await pdfDoc.embedJpg(response.data);

            const posterWidth = 200;
            const posterHeight = 300;
            page.drawImage(posterImage, {
                x: margin,
                y: yPosition - posterHeight - 20,
                width: posterWidth,
                height: posterHeight,
            });
        }
 

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
}
