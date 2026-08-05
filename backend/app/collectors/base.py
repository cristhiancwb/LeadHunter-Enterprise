from abc import ABC, abstractmethod


class BaseCollector(ABC):

    @abstractmethod
    def search(self, keyword: str, city: str):
        pass