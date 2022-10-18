import { ParsedRequest, Theme, FileType } from '../api/_lib/types';
const { H, R, copee } = (window as any);
let timeout = -1;

interface ImagePreviewProps {
    src: string;
    onclick: () => void;
    onload: () => void;
    onerror: () => void;
    loading: boolean;
}

const ImagePreview = ({ src, onclick, onload, onerror, loading }: ImagePreviewProps) => {
    const style = {
        filter: loading ? 'blur(5px)' : '',
        opacity: loading ? 0.1 : 1,
    };
    const title = 'Click to copy image URL to clipboard';
    return H('a',
        { className: 'image-wrapper', href: src, onclick },
        H('img',
            { src, onload, onerror, style, title }
        )
    );
}

interface DropdownOption {
    text: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onchange: (val: string) => void;
    small: boolean;
}

const Dropdown = ({ options, value, onchange, small }: DropdownProps) => {
    const wrapper = small ? 'select-wrapper small' : 'select-wrapper';
    const arrow = small ? 'select-arrow small' : 'select-arrow';
    return H('div',
        { className: wrapper },
        H('select',
            { onchange: (e: any) => onchange(e.target.value) },
            options.map(o =>
                H('option',
                    { value: o.value, selected: value === o.value },
                    o.text
                )
            )
        ),
        H('div',
            { className: arrow },
            '▼'
        )
    );
}

interface TextInputProps {
    value: string;
    oninput: (val: string) => void;
}

const TextInput = ({ value, oninput }: TextInputProps) => {
    return H('div',
        { className: 'input-outer-wrapper' },
        H('div',
            { className: 'input-inner-wrapper' },
            H('input',
                { type: 'text', value, oninput: (e: any) => oninput(e.target.value) }
            )
        )
    );
}

interface ButtonProps {
    label: string;
    onclick: () => void;
}

const Button = ({ label, onclick }: ButtonProps) => {
    return H('button', { onclick }, label);
}

interface FieldProps {
    label: string;
    input: any;
}

const Field = ({ label, input }: FieldProps) => {
    return H('div',
        { className: 'field' },
        H('label', 
            H('div', {className: 'field-label'}, label),
            H('div', { className: 'field-value' }, input),
        ),
    );
}

interface ToastProps {
    show: boolean;
    message: string;
}

const Toast = ({ show, message }: ToastProps) => {
    const style = { transform:  show ? 'translate3d(0,-0px,-0px) scale(1)' : '' };
    return H('div',
        { className: 'toast-area' },
        H('div',
            { className: 'toast-outer', style },
            H('div',
                { className: 'toast-inner' },
                H('div',
                    { className: 'toast-message'},
                    message
                )
            )
        ),
    );
}

const themeOptions: DropdownOption[] = [
    { text: 'Light', value: 'light' },
    { text: 'Dark', value: 'dark' },
];

const fileTypeOptions: DropdownOption[] = [
    { text: 'PNG', value: 'png' },
    { text: 'JPEG', value: 'jpeg' },
];

const markdownOptions: DropdownOption[] = [
    { text: 'Plain Text', value: '0' },
    { text: 'Markdown', value: '1' },
];

const imageLightOptions: DropdownOption[] = [
    { text: 'DefiLlama', value: 'https://defillama.com/defillama-press-kit/defi/SVG/defillama-dark.svg' },
    { text: 'DefiLlamaNFT', value: 'https://defillama.com/defillama-press-kit/nft/SVG/defillama-nft-dark.svg' },
];

const imageDarkOptions: DropdownOption[] = [
    { text: 'DefiLlama', value: 'https://defillama.com/defillama-press-kit/defi/SVG/defillama.svg' },
    { text: 'DefiLlamaNFT', value: 'https://defillama.com/defillama-press-kit/nft/SVG/defillama-nft.svg' },
];

const protocolImage = "https://defillama.com/icons/curve.jpg"


interface AppState extends ParsedRequest {
    loading: boolean;
    showToast: boolean;
    messageToast: string;
    selectedImageIndex: number;
    overrideUrl: URL | null;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
    const setLoadingState = (newState: Partial<AppState>) => {
        window.clearTimeout(timeout);
        if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
            newState.overrideUrl = state.overrideUrl;
        }
        if (newState.overrideUrl) {
            timeout = window.setTimeout(() => setState({ overrideUrl: null }), 200);
        }

        setState({ ...newState, loading: true });
    };
    const {
        fileType = 'jpeg',
        theme = 'light',
        md = false,
        cardName = 'Curve Finance',
        valueHeader = 'Total Value Locked',
        tvl = '$100B',
        volumeChange = "-2%",
        footerURL = "https://defillama.com/protocol/curve",
        images=[imageLightOptions[0].value, protocolImage],
        showToast = false,
        messageToast = '',
        loading = true,
        selectedImageIndex = 0,
        overrideUrl = null,
    } = state;
    
    const mdValue = md ? '1' : '0';
    const imageOptions = theme === 'light' ? imageLightOptions : imageDarkOptions;
    const url = new URL(window.location.origin);
    url.pathname = `${cardName ? encodeURIComponent(cardName) : "default"}.${fileType}`;
    theme && url.searchParams.append('theme', theme);
    mdValue && url.searchParams.append('md', mdValue);
    valueHeader && url.searchParams.append('valueHeader', valueHeader);
    tvl && url.searchParams.append('tvl', tvl);
    volumeChange && url.searchParams.append('volumeChange', volumeChange);
    footerURL && url.searchParams.append("footerURL", encodeURIComponent(footerURL));

    for (let image of images) {
        url.searchParams.append('images', image);
    }
  

    const showAddImageBtn = images.length === 1 ? ( H(Field, {
        label: `Image`,
        input: H(Button, {
            label: `Add Image`,
            onclick: () => {
                const nextImage = 'https://defillama.com/icons/curve.jpg'
                setLoadingState({ images: [...images, nextImage] })
            }
        }),
    })) : H('div');

    return H('div',
        { className: 'split' },
        H('div',
            { className: 'pull-left' },
            H('div',
                H(Field, {
                    label: 'Theme',
                    input: H(Dropdown, {
                        options: themeOptions,
                        value: theme,
                        onchange: (val: Theme) => {
                            const options = val === 'light' ? imageLightOptions : imageDarkOptions
                            let clone = [...images];
                            clone[0] = options[selectedImageIndex].value;
                            setLoadingState({ theme: val, images: clone });
                        }
                    })
                }),
                H(Field, {
                    label: 'File Type',
                    input: H(Dropdown, {
                        options: fileTypeOptions,
                        value: fileType,
                        onchange: (val: FileType) => setLoadingState({ fileType: val })
                    })
                }),
                H(Field, {
                    label: 'Logo',
                    input: H('div',
                        H(Dropdown, {
                            options: imageOptions,
                            value: imageOptions[selectedImageIndex].value,
                            onchange: (val: string) =>  {
                                let clone = [...images];
                                clone[0] = val;
                                const selected = imageOptions.map(o => o.value).indexOf(val);
                                setLoadingState({ images: clone, selectedImageIndex: selected });
                            }
                        }),
                    ),
                }),
                H(Field, {
                    label: 'Text Type',
                    input: H(Dropdown, {
                        options: markdownOptions,
                        value: mdValue,
                        onchange: (val: string) => setLoadingState({ md: val === '1' })
                    })
                }),
                H(Field, {
                    label: 'Name',
                    input: H(TextInput, {
                        value: cardName,
                        oninput: (val: string) => {
                            setLoadingState({ cardName: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Value Header',
                    input: H(TextInput, {
                        value: valueHeader,
                        oninput: (val: string) => {
                            setLoadingState({ valueHeader: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'TVL',
                    input: H(TextInput, {
                        value: tvl,
                        oninput: (val: string) => {
                            setLoadingState({ tvl: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Percent Change',
                    input: H(TextInput, {
                        value: volumeChange,
                        oninput: (val: string) => {
                            setLoadingState({ volumeChange: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Footer URL',
                    input: H(TextInput, {
                        value: footerURL,
                        oninput: (val: string) => {
                            console.log('onurlinput ' + val);
                            setLoadingState({ footerURL: val, overrideUrl: url });
                        }
                    })
                }),
                ...images.slice(1).map((image, i) => H(Field, {
                    label: `Image`,
                    input: H('div',
                        H(TextInput, {
                            value: image,
                            oninput: (val: string) => {
                                let clone = [...images];
                                clone[i + 1] = val;
                                setLoadingState({ images: clone, overrideUrl: url });
                            }
                        }),
                        H('div',
                            { className: 'field-flex' },
                            H(Button, {
                                label: `Remove Image`,
                                onclick: (e: MouseEvent) => {
                                    e.preventDefault();
                                    const filter = (arr: any[]) => [...arr].filter((_, n) => n !== i + 1);
                                    const imagesClone = filter(images);
                                    setLoadingState({ images: imagesClone });
                                }
                            })
                        )
                    )
                })),
                showAddImageBtn
            )
        ),
        H('div',
            { className: 'pull-right' },
            H(ImagePreview, {
                src: overrideUrl ? overrideUrl.href : url.href,
                loading: loading,
                onload: () => setState({ loading: false }),
                onerror: () => {
                    setState({ showToast: true, messageToast: 'Oops, an error occurred' });
                    setTimeout(() => setState({ showToast: false }), 2000);
                },
                onclick: (e: Event) => {
                    e.preventDefault();
                    const success = copee.toClipboard(url.href);
                    if (success) {
                        setState({ showToast: true, messageToast: 'Copied image URL to clipboard' });
                        setTimeout(() => setState({ showToast: false }), 3000);
                    } else {
                        window.open(url.href, '_blank');
                    }
                    return false;
                }
            })
        ),
        H(Toast, {
            message: messageToast,
            show: showToast,
        })
    );
};

R(H(App), document.getElementById('app'));
