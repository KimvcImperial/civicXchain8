// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title MockAggregator
 * @dev Mock Chainlink aggregator for local testing with real environmental data
 */
contract MockAggregator is AggregatorV3Interface {
    int256 private _latestAnswer;
    uint256 private _latestTimestamp;
    uint256 private _latestRound;
    uint8 private _decimals;
    string private _description;

    constructor(int256 _initialAnswer, uint8 _decimalPlaces) {
        _latestAnswer = _initialAnswer;
        _latestTimestamp = block.timestamp;
        _latestRound = 1;
        _decimals = _decimalPlaces;
        _description = "Mock Environmental Data Feed";
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function description() external view override returns (string memory) {
        return _description;
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function getRoundData(uint80 _roundId)
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            _roundId,
            _latestAnswer,
            _latestTimestamp,
            _latestTimestamp,
            _roundId
        );
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            uint80(_latestRound),
            _latestAnswer,
            _latestTimestamp,
            _latestTimestamp,
            uint80(_latestRound)
        );
    }

    // Admin functions for updating data (simulating oracle updates)
    function updateAnswer(int256 _answer) external {
        _latestAnswer = _answer;
        _latestTimestamp = block.timestamp;
        _latestRound++;
    }

    function updateAnswerWithTimestamp(int256 _answer, uint256 _timestamp) external {
        _latestAnswer = _answer;
        _latestTimestamp = _timestamp;
        _latestRound++;
    }

    // Getter functions for testing
    function getLatestAnswer() external view returns (int256) {
        return _latestAnswer;
    }

    function getLatestTimestamp() external view returns (uint256) {
        return _latestTimestamp;
    }

    function getLatestRound() external view returns (uint256) {
        return _latestRound;
    }
}
