describe('Kyuden Isawa', function() {
    integration(function() {
        describe('Kyuden Isawa\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-isawa',
                        inPlay: ['adept-of-the-waves'],
                        hand: ['against-the-waves', 'walking-the-way', 'charge', 'clarity-of-purpose', 'cloud-the-mind'],
                        dynastyDeck: ['mantis-tenkinja']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['voice-of-honor', 'way-of-the-crane']
                    }
                });
                this.clarity = this.player1.findCardByName('clarity-of-purpose');
                this.cloud = this.player1.findCardByName('cloud-the-mind');
                this.charge = this.player1.findCardByName('charge');
                this.mantisTenkinja = this.player1.placeCardInProvince('mantis-tenkinja');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.pass();
                this.againstTheWaves = this.player1.clickCard('against-the-waves');
                this.adeptOfTheWaves = this.player1.clickCard('adept-of-the-waves');
            });

            it('should only let you pay with spell events, not other types', function() {
                this.player2.pass();
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                this.kyudenIsawa = this.player1.clickCard('kyuden-isawa');
                expect(this.player1).toHavePrompt('Select card to discard');
                expect(this.player1).toBeAbleToSelect(this.clarity);
                expect(this.player1).not.toBeAbleToSelect(this.cloud);
                expect(this.player1).not.toBeAbleToSelect(this.charge);
            });

            it('should let you discard a spell card from hand to play a spell from the discard pile, and remove it from the game', function() {
                this.player2.pass();
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                this.kyudenIsawa = this.player1.clickCard('kyuden-isawa');
                expect(this.player1).toHavePrompt('Select card to discard');
                expect(this.player1).toBeAbleToSelect(this.clarity);
                expect(this.player1).not.toBeAbleToSelect(this.charge);
                this.player1.clickCard(this.clarity);

                expect(this.player1).toHavePrompt('Choose a spell event');
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.bowed).toBe(false);
                expect(this.againstTheWaves.location).toBe('removed from game');
            });

            it('should not allow you to play a spell when you don\'t have enough fate', function() {
                this.player2.pass();
                this.player1.fate = 0;
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                this.kyudenIsawa = this.player1.clickCard('kyuden-isawa');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should pass priority', function() {
                this.player2.pass();
                this.kyudenIsawa = this.player1.clickCard('kyuden-isawa');
                this.player1.clickCard(this.clarity);
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should allow you to cancel and choose a different spell', function() {
                this.player2.pass();
                this.walkingTheWay = this.player1.clickCard('walking-the-way');
                this.player1.clickPrompt('Adept of the Waves (3)');
                this.player1.clickCard(this.mantisTenkinja);
                expect(this.walkingTheWay.location).toBe('conflict discard pile');
                this.player2.pass();
                this.kyudenIsawa = this.player1.clickCard('kyuden-isawa');
                this.player1.clickCard(this.clarity);
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Against the Waves');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Kyūden Isawa');
                expect(this.player1).toBeAbleToSelect(this.walkingTheWay);
                this.player1.clickCard(this.walkingTheWay);
                expect(this.player1).toHavePrompt('Walking the Way');
            });

            it('should remove the spell from the game if it is cancelled', function() {
                this.player2.clickCard('way-of-the-crane');
                this.dojiWhisperer = this.player2.clickCard('doji-whisperer');
                expect(this.dojiWhisperer.isHonored).toBe(true);
                this.kyudenIsawa = this.player1.clickCard('kyuden-isawa');
                this.player1.clickCard(this.clarity);
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('voice-of-honor');
                this.player2.clickCard('voice-of-honor');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                expect(this.againstTheWaves.location).toBe('removed from game');
            });
        });

        describe('Kyuden Isawa/Maze of Illusion', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-isawa',
                        inPlay: ['adept-of-the-waves'],
                        hand: ['against-the-waves', 'walking-the-way', 'clarity-of-purpose'],
                        conflictDiscard: ['maze-of-illusion']
                    },
                    player2: {
                        inPlay: ['seppun-guardsman']
                    }
                });
                this.clarity = this.player1.findCardByName('clarity-of-purpose');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['adept-of-the-waves'],
                    defenders: ['seppun-guardsman']
                });
                this.player2.pass();
            });

            it('should allow you to use Kyuden Isawa on Maze of Illusion', function() {
                this.player1.clickCard('kyuden-isawa');
                this.player1.clickCard(this.clarity);
                this.player1.clickCard('maze-of-illusion', 'conflict discard pile');
                expect(this.player1).toHavePrompt('Maze of Illusion');
            });
        });
    });
});
