const DrawCard = require('../../drawcard.js');
const { CardTypes, Players, Locations } = require('../../Constants');

class KnowTheTerrain extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Switch the attacked province with a facedown province',
            effect: 'switch the attacked province card',
            when: {
                onConflictDeclaredBeforeProvinceReveal: (event, context) => event.conflict.conflictProvince.facedown &&
                    context.player.isDefendingPlayer() &&
                    event.conflict.conflictProvince.location !== Locations.StrongholdProvince
            },
            handler: context => this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardTypes.Province,
                context: context,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: card => card.location !== Locations.StrongholdProvince && !card.isBroken && card.facedown && card !== this.game.currentConflict.conflictProvince,
                onSelect: (player, card) => {
                    let attackedprovince = this.game.currentConflict.conflictProvince;
                    let chosenProvince = card;
                    let attackedLocation = attackedprovince.location;
                    let chosenLocation = chosenProvince.location;
                    context.player.moveCard(attackedprovince, chosenLocation);
                    context.player.moveCard(chosenProvince, attackedLocation);

                    chosenProvince.inConflict = true;
                    this.game.currentConflict.conflictProvince.inConflict = false;
                    this.game.currentConflict.conflictProvince = chosenProvince;
                    return true;
                }
            })
        });
    }
}

KnowTheTerrain.id = 'know-the-terrain';

module.exports = KnowTheTerrain;
