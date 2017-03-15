#!/usr/bin/env ruby

require 'json'
require_relative 'anagram_client'
require 'test/unit'

# capture ARGV before TestUnit Autorunner clobbers it

class TestCases < Test::Unit::TestCase

  # runs before each test
  def setup
    @client = AnagramClient.new(ARGV)

    # add words to the dictionary
    @client.post('/words.json', nil, {"words" => ["read", "dear", "dare", "DARE"] }) rescue nil
  end

  # runs after each test
  def teardown
    # delete everything
    @client.delete('/words.json') rescue nil
  end

  def test_adding_words
    res = @client.post('/words.json', nil, {"words" => ["read", "dear", "dare", "DARE"] })

    assert_equal('201', res.code, "Unexpected response code")
  end

  def test_fetching_anagrams
    # fetch anagrams
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")
    assert_not_nil(res.body)

    body = JSON.parse(res.body)

    assert_not_nil(body['anagrams'])

    expected_anagrams = %w(DARE dare dear)
    assert_equal(expected_anagrams, body['anagrams'].sort)
  end

  def test_fetching_anagrams_with_limit
    # fetch anagrams with limit
    res = @client.get('/anagrams/read.json', 'limit=1')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(1, body['anagrams'].size)
  end

  def test_fetch_for_word_with_no_anagrams
    # fetch anagrams with limit
    res = @client.get('/anagrams/zyxwv.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(0, body['anagrams'].size)
  end

  def test_deleting_all_words
    res = @client.delete('/words.json')

    assert_equal('204', res.code, "Unexpected response code")

    # should fetch an empty body
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(0, body['anagrams'].size)
  end

  def test_deleting_all_words_multiple_times
    3.times do
      res = @client.delete('/words.json')

      assert_equal('204', res.code, "Unexpected response code")
    end

    # should fetch an empty body
    res = @client.get('/anagrams/read.json', 'limit=1')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(0, body['anagrams'].size)
  end

  def test_deleting_single_word
    # delete the word
    res = @client.delete('/words/dear.json')

    assert_equal('200', res.code, "Unexpected response code")

    # expect it not to show up in results
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(['DARE', 'dare'], body['anagrams'])
  end

  def test_deleting_single_word_and_anagrams
    # delete the anagrams
    res = @client.delete('/anagrams/dear.json')

    assert_equal('200', res.code, "Unexpected response code")

    # expect them not to show up in results
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal([], body['anagrams']) 
  end

  def test_proper_noun_exclusion
    res = @client.get('/anagrams/read.json', 'exclude_proper_nouns=true')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(2, body['anagrams'].size)
  end

  def test_proper_noun_inclusion
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(3, body['anagrams'].size)
  end

  def test_word_list_are_anagrams
    res = @client.post('/word_list.json', nil, {"words" => ["read", "dear", "dare", "DARE"] })
    
    body = JSON.parse(res.body)

    assert_equal(true, body['anagrams'])
  end

  def test_word_list_arent_anagrams
    res = @client.post('/word_list.json', nil, {"words" => ["read", "dear", "dare", "DAREE"] })

    body = JSON.parse(res.body)

    assert_equal(false, body['anagrams'])
  end
end