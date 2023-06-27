import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useParams } from 'react-router';
import { Refusjon, Refusjonsgrunnlag } from './refusjon/refusjon';
import { useHentRefusjon } from './services/rest-service';

export type SettRefusjonsgrunnlagVerdi = <K extends keyof NonNullable<Refusjonsgrunnlag>, T extends Refusjonsgrunnlag>(
    felt: K,
    verdi: T[K]
) => void;

export interface Context {
    refusjon: Refusjon;
    settRefusjonsgrunnlagVerdi: SettRefusjonsgrunnlagVerdi;
    feilListe: String[];
    setFeilListe: (feilListe: String[]) => void;
    ulagredeEndringer: boolean;
}

export const RefusjonContext = React.createContext<Context>({} as Context);

const RefusjonProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const [refusjon, setRefusjon] = useState<Refusjon>({} as Refusjon);
    const [ulagredeEndringer, setUlagredeEndringer] = useState(false);
    const [feilListe, setFeilListe] = useState<String[]>([]);

    const { refusjonId } = useParams();
    const nyRefusjon = useHentRefusjon(refusjonId);
    if (refusjon !== nyRefusjon) {
        setRefusjon(nyRefusjon);
    }

    const settRefusjonsgrunnlagVerdi = <K extends keyof NonNullable<Refusjonsgrunnlag>, T extends Refusjonsgrunnlag>(
        felt: K,
        verdi: T[K]
    ): Refusjon | undefined => {
        const nyRefusjon = { ...refusjon, gjeldendeInnhold: { ...refusjon.refusjonsgrunnlag, [felt]: verdi } };
        setRefusjon(nyRefusjon);
        setUlagredeEndringer(true);
        return nyRefusjon;
    };

    const refusjonContext: Context = {
        refusjon,
        settRefusjonsgrunnlagVerdi,
        feilListe,
        setFeilListe,
        ulagredeEndringer,
    };

    return <RefusjonContext.Provider value={refusjonContext}>{props.children}</RefusjonContext.Provider>;
};
export default RefusjonProvider;
