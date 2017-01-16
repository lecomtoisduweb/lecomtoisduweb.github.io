---
layout: post
title: "How to use React state"
cover: /assets/images/blog/lancement2.jpg
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac iaculis mauris, vel auctor erat. Quisque eget ipsum a orci varius cursus vel vel turpis. Integer ex sem, lacinia egestas feugiat id, interdum a velit. Curabitur turpis elit, sagittis ut posuere in, sollicitudin nec metus. Suspendisse facilisis posuere nisi, vitae maximus nunc hendrerit ut. Quisque eget vestibulum dui, ac rhoncus risus. Quisque id justo id arcu euismod ullamcorper. **Pellentesque** *habitant* morbi tristique senectus et netus et malesuada fames ac turpis egestas. In nibh nisl, gravida et ultrices eu, aliquam a libero. Etiam bibendum, risus nec blandit commodo, lacus velit vehicula nisi, ut varius sapien lectus auctor diam. Aenean congue tristique venenatis. Ut ut velit porttitor, dapibus leo sed, viverra turpis. Sed eu purus dapibus, tincidunt sem eget, vehicula elit. Cras ac tincidunt erat. Maecenas vitae metus id elit lacinia vestibulum.

```js
import React, {
    Component,
    PropTypes,
} from 'react';
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
} from 'react-intl';
import classnames from 'classnames';

export const KEY_CODE_BACKSPACE = 8;
export const KEY_CODE_ENTER = 13;
export const KEY_CODE_TAB = 9;

const messages = defineMessages({
    label: {
        defaultMessage: 'Choose some tags (press enter or tab to add it)',
        description: 'Label of tags in the upload form',
        id: 'upload.form.tags.label',
    },
    placeholder: {
        defaultMessage: 'Landscape, sunset...',
        description: 'Placeholder of tags in the upload form',
        id: 'upload.form.tags.placeholder',
    },
});
```

Aliquam mollis finibus dui sed porttitor. Nullam dignissim imperdiet ante eget tincidunt. Aliquam sit amet eleifend sapien. Cras non urna non mauris suscipit dignissim ut sed nisl. Curabitur eu aliquam ex. Suspendisse ac condimentum felis. Morbi porta turpis a arcu auctor imperdiet. Phasellus vel libero a dolor lobortis condimentum. Integer vulputate ipsum ac blandit iaculis. Pellentesque non lacus eleifend, fringilla ex viverra, condimentum elit.

Mauris finibus tortor orci, et pretium sapien maximus quis. Etiam odio neque, dapibus non tempor et, imperdiet ac tortor. Morbi feugiat fringilla maximus. Proin porttitor erat tortor, et placerat tellus eleifend nec. Pellentesque vel nulla id leo scelerisque pharetra id rutrum tellus. Etiam vitae lectus sit amet elit feugiat interdum. Cras aliquam ipsum at laoreet maximus. Pellentesque placerat ultricies efficitur. Phasellus libero diam, malesuada nec justo at, iaculis fringilla sem. Nam elementum, urna et molestie vulputate, dolor nisi sodales arcu, a lobortis arcu ex commodo erat. Duis vitae auctor mauris.

Maecenas finibus viverra lacinia. Aliquam non lorem elementum lectus vulputate imperdiet. Sed dictum hendrerit arcu nec dignissim. Donec nec dui sed ante ullamcorper convallis. Nullam rhoncus consequat vulputate. Nunc nunc lectus, placerat eu nulla ut, porta scelerisque lorem. Cras euismod libero est, at consequat tellus aliquam non. Mauris commodo pharetra risus, in sollicitudin neque facilisis ut. Donec sagittis consequat purus nec imperdiet. Sed rutrum nec lorem aliquet finibus.

![test](/assets/images/blog/lancement2.jpg)

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc non tempor orci. Fusce accumsan, libero vel gravida sagittis, orci nulla convallis arcu, eu ullamcorper nunc mauris a sapien. Suspendisse arcu mi, ornare eu hendrerit sed, eleifend id neque. Mauris iaculis eros ac velit porta, sit amet rutrum neque consectetur. Curabitur commodo fermentum leo, eu convallis ipsum auctor sit amet. Aenean tristique commodo enim ut consequat. Etiam et odio eget metus mollis cursus. Vivamus ac arcu quis lorem pharetra sagittis vitae id ex. Ut arcu nisi, efficitur finibus massa quis, varius consectetur ante. Nam imperdiet libero arcu. Suspendisse ut pulvinar leo. Phasellus mollis neque nibh, quis convallis nibh varius eu.

Mauris pharetra rutrum tellus a gravida. Nullam vitae lorem dui. Phasellus sit amet enim sodales, iaculis erat elementum, eleifend leo. Morbi consectetur lorem nunc, a pellentesque nisl condimentum quis. Nullam sed nisi ut felis vestibulum ultrices ac ac nulla. Nullam vitae est ipsum. Quisque quis placerat mauris, nec vulputate nulla. Nunc ultricies tortor ut nulla sollicitudin sagittis.

```js
export class Tags extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            value: props.input.value || [],
            inputValue: '',
        };

        this.onKeyEvent = this.onKeyEvent.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.input.value,
        });
    }

    componentDidUpdate() {
        const {
            input: {
                onChange,
            },
        } = this.props;

        onChange(this.state.value);

        this.input.focus();
    }

    onKeyEvent(event) {
        const keyCode = event.keyCode || event.which;
        const { inputValue } = this.state;

        if (inputValue.length) {
            if (keyCode === KEY_CODE_TAB || keyCode === KEY_CODE_ENTER) {
                event.preventDefault();
                return this.commit();
            }
        } else {
            if (keyCode === KEY_CODE_BACKSPACE) {
                event.preventDefault();
                return this.revert();
            }
        }

        return true;
    }

    onChange(event) {
        this.setState({
            inputValue: event.target.value,
        });
    }

    commit() {
        this.setState(({ inputValue, value }) => ({
            value: [...value.filter(v => v !== inputValue), inputValue],
            inputValue: '',
        }));

        return false;
    }

    revert(index = null) {
        if (index === null) {
            this.setState(({ value }) => ({
                inputValue: value.slice(-1)[0],
                value: [...value].slice(0, value.length - 1),
            }));
            return false;
        }

        const value = [...this.state.value];
        value.splice(index, 1);
        this.setState({
            value,
        });

        return false;
    }

    render() {
        const {
            intl: {
                formatMessage,
            },
            meta: {
                submitting,
            },
        } = this.props;

        const {
            inputValue,
            value,
        } = this.state;

        return (
            <div className="bs-form__field">
                <label
                    className={classnames('bs-input__label', 'bs-input__label--block', {
                        'bs-input--pending__label': submitting,
                        'bs-input--default__label': !submitting,
                    })}
                    htmlFor="tags"
                >
                    <FormattedMessage {...messages.label} />
                </label>
                {value.map((tag, key) => (
                    <div
                        className={classnames('bs-tag', {
                            'bs-tag--default': !submitting,
                            'bs-tag--pending': submitting,
                        })}
                        key={key}
                    >
                        {tag}
                        {submitting ? null : (
                            <span
                                className={classnames('bs-tag__delete', {
                                    'bs-tag--default__delete': !submitting,
                                    'bs-tag--pending__delete': submitting,
                                })}
                                onClick={!submitting && this.revert.bind(this, key)}
                            >
                                x
                            </span>
                        )}
                    </div>
                ))}
                <input
                    className={classnames('bs-input bs-tag', {
                        'bs-input--pending': submitting,
                        'bs-input--default': !submitting,
                        'bs-tag--default': !submitting,
                    })}
                    disabled={submitting}
                    name="tags"
                    onChange={this.onChange}
                    onKeyDown={this.onKeyEvent}
                    placeholder={!submitting ? formatMessage(messages.placeholder) : null}
                    ref={input => { this.input = input; }}
                    type="text"
                    value={inputValue}
                />
            </div>

        );
    }
}

Tags.propTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        value: PropTypes.array.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        submitting: PropTypes.bool,
    }),
};

export default injectIntl(Tags);

```

In nisi enim, luctus sed posuere vel, aliquam vitae elit. Nam semper quis justo eget gravida. Donec finibus urna ex, vel viverra diam hendrerit nec. Etiam eu risus eu mi egestas aliquam ut at turpis. Donec dignissim ac neque id dictum. Donec a magna vel sapien porta mollis. Suspendisse eleifend eros justo, eu pellentesque felis tempus eget.

Vestibulum at ex est. Praesent maximus varius mi, id ultricies lacus sagittis aliquam. Maecenas pharetra eu mauris ac tincidunt. Ut vehicula augue vitae ultricies lacinia. Donec a tortor eleifend, sodales sem a, tincidunt dolor. Mauris porttitor pulvinar enim, in aliquet arcu. Phasellus quam neque, luctus non faucibus eu, lacinia sit amet nibh. Curabitur eu molestie tellus. Nunc sagittis pretium eleifend. Nulla a dui tristique ligula suscipit varius eget et libero. Donec iaculis ligula ac est consequat vulputate ut id sapien. Ut venenatis blandit dolor quis pellentesque. Phasellus tincidunt cursus libero, vel cursus purus ultrices et.

Praesent sit amet auctor orci, vitae hendrerit odio. Nulla facilisi. Proin sed enim pharetra, vehicula arcu id, tincidunt ex. Vestibulum in est congue, interdum sapien a, tempus nulla. Suspendisse posuere sed felis quis luctus. Nulla iaculis, ex nec rutrum lobortis, nibh arcu mattis lacus, pellentesque convallis justo tortor in mauris. Ut at pulvinar sem, in sodales velit.

In consequat eros eget lorem imperdiet, ut tempor eros pulvinar. Proin nisl magna, blandit a fermentum vitae, luctus quis magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut id purus sed dolor pulvinar tempor ac vitae ante. Donec varius lectus a vestibulum venenatis. In malesuada turpis vitae rhoncus faucibus. Ut luctus nisl in sem auctor cursus. Vestibulum gravida lectus at enim iaculis, sit amet ultrices neque suscipit. Donec ac porta ex. Morbi ornare eros ac convallis facilisis. Suspendisse ut lobortis felis. Praesent vitae metus sodales, fringilla turpis nec, mollis metus. Praesent sodales sit amet dolor bibendum luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis vehicula ultrices nisi vel eleifend. Nullam facilisis ex enim, vitae blandit tellus tincidunt vel.

Duis eu vestibulum eros, eu scelerisque felis. Praesent lobortis lacinia velit, at fermentum eros semper eget. Praesent purus tortor, eleifend eget porta quis, porttitor vitae lectus. Nullam eget venenatis lectus. Nullam eu neque nisl. Duis est dolor, malesuada id sem sit amet, rutrum eleifend felis. Nulla mollis sapien vitae nisi aliquet condimentum. Proin urna velit, porta non egestas et, molestie vestibulum arcu. Donec pellentesque mauris nec blandit eleifend. Donec egestas tortor vulputate augue placerat, id pretium massa malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu nisi eget nisl lacinia posuere vel ut mi. Duis lacinia ullamcorper ipsum, eget convallis turpis.

Aliquam pharetra consectetur sagittis. Donec malesuada, nibh ut egestas viverra, metus nulla efficitur diam, ut semper sem risus sed diam. Sed at quam vitae diam lobortis auctor vestibulum a ligula. In non tincidunt justo. Donec facilisis ultrices leo sit amet commodo. Etiam iaculis odio sed orci tempus porttitor. Donec ac velit sed dolor dapibus elementum id et libero.

Sed purus velit, lacinia eu ante sed, gravida lobortis massa. Vivamus iaculis eros a mi rutrum hendrerit. Aliquam tristique hendrerit ipsum, at rutrum urna sollicitudin non. Nam varius a justo ut sollicitudin. Maecenas porta in neque nec eleifend. Aliquam feugiat mi sem, id eleifend quam eleifend eu. Etiam ultrices nec magna sed vestibulum.

Sed sagittis urna ac lorem porttitor auctor. Praesent mattis ligula ullamcorper tempor mattis. Duis quis porttitor est, quis ornare dolor. Sed pulvinar, turpis et consectetur consequat, odio lacus accumsan ex, in dignissim magna leo ac dui. Etiam ac tempus dui, sit amet ultrices metus. Vivamus venenatis augue eu sem mollis lobortis. Maecenas consequat nunc nisl, in mollis turpis egestas at. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam dictum sed eros ac sodales. Cras ultricies quis tellus non lacinia.

Nullam pellentesque, quam ac eleifend pellentesque, leo magna ultrices sapien, vel imperdiet lorem urna ut libero. Integer eros mauris, interdum et lectus a, consectetur tincidunt purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut at imperdiet enim, sit amet luctus risus. Proin eu metus ex. Phasellus pharetra nibh et magna venenatis placerat. Aenean ultricies risus in est accumsan venenatis. Fusce nec malesuada ante. Sed lobortis aliquam lectus, vel ullamcorper nunc fermentum quis. Nullam laoreet elementum orci, pretium varius dui feugiat imperdiet. Proin ac lobortis felis, a varius sem. Vestibulum commodo, turpis eu tempus congue, urna neque scelerisque justo, id tincidunt odio felis vel ipsum.
