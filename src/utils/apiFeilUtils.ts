import { Feilkode, Feilmeldinger } from '../feilkodemapping';
import { ApiError, FeilkodeError } from '../services/rest-service';

export const handterFeil = (
    error: Error,
    visFeilmelding: (feilmelding: string) => void,
    fallbackMelding: string = 'Det har skjedd en uventet feil'
) => {
    switch (error.constructor) {
        case FeilkodeError:
            const feilmeldingTekst = Feilmeldinger[error.message as Feilkode];
            if (!feilmeldingTekst) {
                visFeilmelding('Det har skjedd en feil: ' + error.message);
                //Sentry.captureEvent({ message: 'Feilmelding er ikke mappet: ' + error.message });
                break;
            }
            visFeilmelding(feilmeldingTekst);
            break;
        case ApiError:
            visFeilmelding(error.message || fallbackMelding);
            break;
        default:
            throw error;
    }
};
