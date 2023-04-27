import React, { FunctionComponent, useState } from 'react';
import { Refusjon, Refusjonsgrunnlag } from './refusjon/refusjon';

export type SettRefusjonsgrunnlagVerdi = <K extends keyof NonNullable<Refusjonsgrunnlag>, T extends Refusjonsgrunnlag>(
    felt: K,
    verdi: T[K]
) => void;

export interface Context {
    refusjon: Refusjon;
    settRefusjonVerdier: (refusjon: Refusjon) => void;
    settRefusjonsgrunnlagVerdi: SettRefusjonsgrunnlagVerdi;
    feilListe: String[];
    setFeilListe: (feilListe: String[]) => void;
    ulagredeEndringer: boolean;
}

export const RefusjonContext = React.createContext<Context>({} as Context);

const RefusjonProvider: FunctionComponent = (props) => {
    const [refusjon, setRefusjon] = useState<Refusjon>({} as Refusjon);
    const [ulagredeEndringer, setUlagredeEndringer] = useState(false);
    const [feilListe, setFeilListe] = useState<String[]>([]);

    const settRefusjonVerdier = (refusjon: Refusjon) => {
        setRefusjon(refusjon);
    };

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
        settRefusjonVerdier,
        settRefusjonsgrunnlagVerdi,
        feilListe,
        setFeilListe,
        ulagredeEndringer,
    };

    return <RefusjonContext.Provider value={refusjonContext}>{props.children}</RefusjonContext.Provider>;
};
export default RefusjonProvider;
