var should = require('should'),
	Lexer = require('../').Lexer,
	lexer = new Lexer();

describe('Lexer', function() {
	it('should handle commentary starting with semicolon ending on EOL', function() {
		var tokens = lexer.lex('; foo\nfoo');
		should.exist(tokens[0]);
		tokens[0].should.have.property('name', 'commentary');
		tokens[0].should.have.property('value', ' foo');
	});

	it('should handle commentary starting with semicolon ending on EOF', function() {
		var tokens = lexer.lex('; foo');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'commentary');
		tokens[0].should.have.property('value', ' foo');
	});

	it('should handle integer', function() {
		var tokens = lexer.lex('42');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'integer');
		tokens[0].should.have.property('value', '42');
	});

	it('should handle single period', function() {
		var tokens = lexer.lex('.');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'periods');
		tokens[0].should.have.property('value', '.');
	});

	it('should handle multiple periods', function() {
		var tokens = lexer.lex('........');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'periods');
		tokens[0].should.have.property('value', '........');
	});

	it('should handle asterisk', function() {
		var tokens = lexer.lex('*');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'asterisk');
		tokens[0].should.have.property('value', '*');
	});

	it('should handle symbol', function() {
		var tokens = lexer.lex('foo');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'symbol');
		tokens[0].should.have.property('value', 'foo');
	});

	it('should handle brackets', function() {
		var tokens = lexer.lex('[]');
		tokens.should.have.length(2);
		tokens[0].should.have.property('name', 'open-bracket');
		tokens[0].should.have.property('value', '[');
		tokens[1].should.have.property('name', 'close-bracket');
		tokens[1].should.have.property('value', ']');
	});

	it('should handle curly braces', function() {
		var tokens = lexer.lex('{ foo }');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'commentary');
		tokens[0].should.have.property('value', ' foo ');
	});

	it('should handle parens', function() {
		var tokens = lexer.lex('()');
		tokens.should.have.length(2);
		tokens[0].should.have.property('name', 'open-paren');
		tokens[0].should.have.property('value', '(');
		tokens[1].should.have.property('name', 'close-paren');
		tokens[1].should.have.property('value', ')');
	});

	it('should handle asterisk', function() {
		var tokens = lexer.lex('*');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'asterisk');
		tokens[0].should.have.property('value', '*');
	});

	it('should handle symbols with punctuation', function() {
		var tokens = lexer.lex('a2-+#=:');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'symbol');
		tokens[0].should.have.property('value', 'a2-+#=:');
	});

	it('should handle string', function() {
		var tokens = lexer.lex('"foo"');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'string');
		tokens[0].should.have.property('value', 'foo');
	});

	it('should handle angle brackets', function() {
		var tokens = lexer.lex('<>');
		tokens.should.have.length(2);
		tokens[0].should.have.property('name', 'reserved');
		tokens[0].should.have.property('value', '<');
		tokens[1].should.have.property('name', 'reserved');
		tokens[1].should.have.property('value', '>');
	});

	it('should handle string with escapes', function() {
		var tokens = lexer.lex('"\\"\\\\\\t"');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'string');
		tokens[0].should.have.property('value', '"\\\\t');
	});

	it('should blow up on unterminated commentary', function() {
		(function() { lexer.lex('{ foo'); }).should.throwError('Expected to find "}" after 0');
	});

	it('should blow up on unterminated strings', function() {
		(function() { lexer.lex('"foo'); }).should.throwError('Unterminated string at 0');
	});

	it('should handle tag pair', function() {
		var tokens = lexer.lex('[Foo "foo"]');
		tokens.should.have.length(4);
		tokens[0].should.have.property('name', 'open-bracket');
		tokens[1].should.have.property('name', 'symbol');
		tokens[1].should.have.property('value', 'Foo');
		tokens[2].should.have.property('name', 'string');
		tokens[2].should.have.property('value', 'foo');
		tokens[3].should.have.property('name', 'close-bracket');
	});

	it('should handle NAG', function() {
		var tokens = lexer.lex('$20');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'nag');
		tokens[0].should.have.property('value', '20');
	});

	it('should handle escape on first line', function() {
		var tokens = lexer.lex('% escaped');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'escape');
		tokens[0].should.have.property('value', ' escaped');
	});

	it('should handle escape not on first line', function() {
		var tokens = lexer.lex('foo\n% escaped\nbar');
		should.exist(tokens[1]);
		tokens[1].should.have.property('name', 'escape');
		tokens[1].should.have.property('value', ' escaped');
	});

	it('should handle NAG with large number', function() {
		var tokens = lexer.lex('$23489');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'nag');
		tokens[0].should.have.property('value', '23489');
	});

	it('should handle traditional NAG', function() {
		var tokens = lexer.lex('d4!?');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'symbol');
		tokens[0].should.have.property('value', 'd4!?');
	});

	it('should handle draws', function() {
		var tokens = lexer.lex('1/2-1/2');
		tokens.should.have.length(1);
		tokens[0].should.have.property('name', 'symbol');
		tokens[0].should.have.property('value', '1/2-1/2');
	});

	it('should blow up on invalid NAG', function() {
		(function() { lexer.lex('$foo'); }).should.throwError('Expected numeric annotation glyph at 0');
	});

	it('should blow up on invalid input character', function() {
		var invalidChar = String.fromCharCode(1);
		(function() { lexer.lex(invalidChar); })
			.should
			.throwError('Invalid input character "' + invalidChar + '" (code point: 1) at 0');
	});

	it('should handle movetext', function() {
		var tokens = lexer.lex('1. e4 e5 2. Nf3 Nf6 1-0');
		tokens.should.have.length(9);
		tokens[0].should.have.property('name', 'integer');
		tokens[0].should.have.property('value', '1');
		tokens[1].should.have.property('name', 'periods');
		tokens[1].should.have.property('value', '.');
		tokens[2].should.have.property('name', 'symbol');
		tokens[2].should.have.property('value', 'e4');
		tokens[3].should.have.property('name', 'symbol');
		tokens[3].should.have.property('value', 'e5');
		tokens[4].should.have.property('name', 'integer');
		tokens[4].should.have.property('value', '2');
		tokens[5].should.have.property('name', 'periods');
		tokens[5].should.have.property('value', '.');
		tokens[6].should.have.property('name', 'symbol');
		tokens[6].should.have.property('value', 'Nf3');
		tokens[7].should.have.property('name', 'symbol');
		tokens[7].should.have.property('value', 'Nf6');
		tokens[8].should.have.property('name', 'symbol');
		tokens[8].should.have.property('value', '1-0');
	});
});